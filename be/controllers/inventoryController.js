// === SỬA LẠI IMPORT: Lấy các model từ index.js ===
const { Inventory, Product, Store, StoreUser, StockAdjustment, ImportReceipt, ImportReceiptDetail, User } = require('../models'); 
// Giả sử các model đã được nạp trong models/index.js

/**
 * Lấy danh sách sản phẩm kèm tồn kho chi tiết (Admin Inventory Page)
 * LƯU Ý: Chúng ta sẽ KHÔNG DÙNG hàm này, vì productController.getAllProducts đã làm tốt hơn.
 * Giữ lại để tham khảo.
 */
exports.getAllInventory = async (req, res) => {
    try {
        // Cách làm đúng là lấy từ Product
        const products = await Product.findAll({
            include: [
                { model: Category, as: 'category' },
                { 
                    model: Inventory, 
                    as: 'inventories',
                    include: [{ model: Store, as: 'store' }]
                }
            ]
        });

        res.json({ success: true, data: products });

    } catch (error) {
        console.error('Error getting all inventory:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi lấy thông tin kho hàng' });
    }
};

/**
 * Cập nhật nhanh số lượng tồn kho tại một cơ sở (Quick Edit)
 * === ĐÂY LÀ HÀM ĐÃ ĐƯỢC SỬA ===
 */
exports.updateInventoryQuantity = async (req, res) => {
    const { productId, storeId } = req.params;
    const { quantity, reason } = req.body;
    const userRole = req.user.role;
    const userId = req.user.id;

    if (isNaN(parseInt(quantity)) || parseInt(quantity) < 0) {
        return res.status(400).json({ success: false, message: 'Số lượng không hợp lệ.' });
    }

    try {
        // Warehouse Manager Restriction Check
        if (userRole === 'ROLE_WAREHOUSE_MANAGER') {
            const isAssigned = await StoreUser.findOne({ where: { user_id: userId, store_id: storeId } });
            if (!isAssigned) {
                return res.status(403).json({ success: false, message: 'Vai trò của bạn không được phép quản lý kho hàng của cơ sở này.' });
            }
        }
        
        let old_quantity = 0;
        
        // Tìm bản ghi inventory cụ thể
        let inventoryItem = await Inventory.findOne({
            where: {
                product_id: productId,
                store_id: storeId
            }
        });

        if (inventoryItem) {
            old_quantity = inventoryItem.quantity;
            // Nếu tìm thấy, cập nhật nó
            await inventoryItem.update({ quantity: parseInt(quantity) });
        } else {
            // Nếu không tìm thấy, tạo mới (hữu ích cho việc nhập kho lần đầu)
            inventoryItem = await Inventory.create({
                product_id: productId,
                store_id: storeId,
                quantity: parseInt(quantity)
            });
        }

        // Lưu log StockAdjustment
        await StockAdjustment.create({
            product_id: productId,
            adjusted_by: userId,
            old_quantity: old_quantity,
            new_quantity: parseInt(quantity),
            reason: reason || "Chỉnh sửa thủ công",
            store_id: storeId
        });

        res.json({ 
            success: true, 
            message: 'Cập nhật tồn kho thành công',
            data: inventoryItem
        });

    } catch (error) {
        console.error('Error quick updating inventory:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi cập nhật tồn kho' });
    }
};

/**
 * Lấy lịch sử cập nhật kho của một sản phẩm (từ nhập kho và điều chỉnh)
 */
exports.getProductInventoryHistory = async (req, res) => {
    const { productId } = req.params;
    const { storeId } = req.query; // Tùy chọn lọc theo cơ sở

    try {
        // Lấy lịch sử nhập kho
        const importDetailWhere = { product_id: productId };
        if (storeId && storeId !== 'all') importDetailWhere.store_id = storeId;
        
        const importDetails = await ImportReceiptDetail.findAll({
            where: importDetailWhere,
            include: [
                {
                    model: ImportReceipt,
                    as: 'receipt',
                    include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }]
                },
                { model: Store, as: 'store', attributes: ['id', 'name'] }
            ]
        });

        // Lấy lịch sử điều chỉnh
        const adjustmentWhere = { product_id: productId };
        if (storeId && storeId !== 'all') adjustmentWhere.store_id = storeId;

        const adjustments = await StockAdjustment.findAll({
            where: adjustmentWhere,
            include: [
                { model: User, as: 'adjuster', attributes: ['id', 'name', 'email'] },
                { model: Store, as: 'store', attributes: ['id', 'name'] }
            ]
        });

        // Chuẩn hóa dữ liệu
        let history = [];

        importDetails.forEach(detail => {
            if (detail.receipt) {
                history.push({
                    type: 'IMPORT',
                    id: `import_${detail.id}`,
                    created_at: detail.receipt.created_at,
                    quantity_change: detail.quantity,
                    store: detail.store ? detail.store.name : 'N/A',
                    store_id: detail.store_id,
                    user: detail.receipt.creator ? detail.receipt.creator.name || detail.receipt.creator.email : 'N/A',
                    note: `Phiếu nhập #${detail.receipt.id}` + (detail.receipt.note ? ` - ${detail.receipt.note}` : '')
                });
            }
        });

        adjustments.forEach(adj => {
            history.push({
                type: 'ADJUST',
                id: `adjust_${adj.id}`,
                created_at: adj.created_at,
                quantity_change: adj.new_quantity - adj.old_quantity,
                old_quantity: adj.old_quantity,
                new_quantity: adj.new_quantity,
                store: adj.store ? adj.store.name : 'N/A',
                store_id: adj.store_id,
                user: adj.adjuster ? adj.adjuster.name || adj.adjuster.email : 'N/A',
                note: adj.reason || 'Chỉnh sửa thủ công'
            });
        });

        // Sắp xếp theo thời gian giảm dần
        history.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        res.json({ success: true, data: history });

    } catch (error) {
        console.error('Error fetching inventory history:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi lấy lịch sử tồn kho' });
    }
};
// === SỬA LẠI IMPORT: Lấy các model từ index.js ===
const { Inventory, Product, Store, StoreUser, StockAdjustment } = require('../models'); 
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
const { sequelize, ImportReceipt, ImportReceiptDetail, Inventory, Product } = require('../models');

exports.createImportReceipt = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { supplier_name, note, store_id, items } = req.body;
    const userId = req.user.id;

    if (!store_id || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ.' });
    }

    let total_amount = 0;
    const detailsData = [];

    // Tính tổng và chuẩn bị dữ liệu chi tiết
    for (const item of items) {
      const { product_id, quantity, unit_price } = item;
      const total_price = quantity * unit_price;
      total_amount += total_price;

      detailsData.push({
        product_id,
        quantity,
        unit_price,
        total_price,
        store_id
      });
    }

    // Tạo phiếu nhập
    const receipt = await ImportReceipt.create({
      created_by: userId,
      supplier_name: supplier_name || 'Khách vãng lai',
      total_amount,
      note,
      store_id,
      created_at: new Date()
    }, { transaction });

    // Tạo chi tiết phiếu nhập
    const itemsToCreate = detailsData.map(item => ({ ...item, receipt_id: receipt.id }));
    await ImportReceiptDetail.bulkCreate(itemsToCreate, { transaction });

    // Cập nhật Inventory
    for (const item of detailsData) {
      const { product_id, quantity } = item;
      let inventoryItem = await Inventory.findOne({
        where: { product_id, store_id },
        transaction
      });

      if (inventoryItem) {
        await inventoryItem.update({ quantity: inventoryItem.quantity + quantity }, { transaction });
      } else {
        await Inventory.create({
          product_id,
          store_id,
          quantity
        }, { transaction });
      }
    }

    await transaction.commit();
    res.status(201).json({ success: true, message: 'Tạo phiếu nhập thành công', data: receipt });

  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error('Lỗi tạo phiếu nhập:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const { sequelize, Product, Category, Gallery, Inventory, Store } = require('../models');

// Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    const whereCondition = {};
    if (!req.query.includeDeleted) {
      whereCondition.deleted = 0;
    }

    const products = await Product.findAll({
      where: whereCondition,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'thumbnail']
        },
        {
          model: Gallery,
          as: 'galleries',
          attributes: ['id', 'thumbnail']
        },
        {
          model: Inventory,
          as: 'inventories',
          include: [{
            model: Store,
            as: 'store',
            attributes: ['id', 'name', 'address']
          }]
        }
      ]
    });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy sản phẩm theo ID
exports.getProductById = async (req, res) => {
  try {
    const whereCondition = { id: req.params.id };
    if (!req.query.includeDeleted) {
      whereCondition.deleted = 0;
    }

    const product = await Product.findOne({
      where: whereCondition,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'thumbnail']
        },
        {
          model: Gallery,
          as: 'galleries',
          attributes: ['id', 'thumbnail']
        },
        {
          model: Inventory,
          as: 'inventories',
          include: [{
            model: Store,
            as: 'store',
            attributes: ['id', 'name', 'address']
          }]
        }
      ]
    });
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }
    
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tạo sản phẩm mới
// Thay thế hàm createProduct cũ bằng hàm này
exports.createProduct = async (req, res) => {
  // Dùng transaction để đảm bảo an toàn
  const transaction = await sequelize.transaction(); 
  
  try {
    const { 
      category_id, 
      title, 
      price, 
      discount, 
      thumbnail, 
      description,
      inventoryData // Đây là mảng kho hàng gửi từ React
    } = req.body;
    
    // Bước 1: Tạo sản phẩm
    const product = await Product.create({
      category_id,
      title,
      price,
      discount,
      thumbnail,
      description,
      deleted: 0,
      created_at: new Date(),
      updated_at: new Date()
    }, { transaction }); // Thêm transaction

    // Bước 2: Thêm dữ liệu kho (nếu có)
    if (inventoryData && Array.isArray(inventoryData) && inventoryData.length > 0) {
      const inventoryRecords = inventoryData.map(item => ({
        product_id: product.id,
        store_id: item.store_id,
        quantity: item.quantity || 0
      }));
      
      await Inventory.bulkCreate(inventoryRecords, { transaction }); // Thêm transaction
    }

    // Nếu mọi thứ thành công, commit transaction
    await transaction.commit();
    
    res.status(201).json({ success: true, data: product });

  } catch (error) {
    // Nếu có lỗi, rollback tất cả
    await transaction.rollback(); 
    res.status(500).json({ success: false, message: error.message });
  }
};;

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  try {
    const { category_id, title, price, discount, thumbnail, description } = req.body;
    
    // Admin có thể update sản phẩm đã bị xóa mềm, nên bỏ điều kiện deleted: 0
    const product = await Product.findOne({ where: { id: req.params.id } });
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }
    
    await product.update({
      category_id,
      title,
      price,
      discount,
      thumbnail,
      description,
      updated_at: new Date()
    });
    
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa mềm sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ where: { id: req.params.id } });
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }
    
    await product.update({ deleted: 1, updated_at: new Date() });
    
    res.json({ success: true, message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Đổi trạng thái kinh doanh của sản phẩm
exports.toggleProductStatus = async (req, res) => {
  try {
    const { deleted } = req.body; // 0 hoặc 1
    
    const product = await Product.findOne({ where: { id: req.params.id } });
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }
    
    await product.update({ deleted: deleted, updated_at: new Date() });
    
    res.json({ success: true, message: 'Cập nhật trạng thái kinh doanh thành công', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy sản phẩm theo danh mục
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { 
        category_id: req.params.categoryId,
        deleted: 0 
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'thumbnail']
        }
      ]
    });
    
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
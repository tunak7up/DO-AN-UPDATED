const { Category, Product } = require('../models');

// Lấy tất cả danh mục
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{
        model: Product,
        as: 'products',
        where: { deleted: 0 },
        required: false,
        attributes: ['id', 'title', 'price', 'discount', 'thumbnail']
      }]
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy danh mục theo ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{
        model: Product,
        as: 'products',
        where: { deleted: 0 },
        required: false
      }]
    });
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });
    }
    
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tạo danh mục mới
exports.createCategory = async (req, res) => {
  try {
    const { name, thumbnail } = req.body;
    
    const category = await Category.create({
      name,
      thumbnail
    });
    
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật danh mục
exports.updateCategory = async (req, res) => {
  try {
    const { name, thumbnail } = req.body;
    
    const category = await Category.findByPk(req.params.id);
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });
    }
    
    await category.update({ name, thumbnail });
    
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa danh mục
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });
    }
    
    await category.destroy();
    
    res.json({ success: true, message: 'Xóa danh mục thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
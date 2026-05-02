const { ServiceCategory } = require('../models');

const serviceCategoryController = {
  // Lấy danh sách tất cả service categories
  getAllCategories: async (req, res) => {
    try {
      const categories = await ServiceCategory.findAll();
      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('Error getting service categories:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách danh mục dịch vụ'
      });
    }
  }
};

module.exports = serviceCategoryController;

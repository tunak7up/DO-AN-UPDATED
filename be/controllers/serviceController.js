const { Service, ServiceCategory } = require('../models');

const serviceController = {
  // Tạo dịch vụ mới
  createService: async (req, res) => {
    try {
      const { name, category_id, price, description, is_active, thumbnail } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Tên dịch vụ là bắt buộc'
        });
      }

      const newService = await Service.create({
        name,
        category_id: category_id || null,
        price: price || null,
        description: description || null,
        is_active: is_active !== undefined ? is_active : true,
        thumbnail: thumbnail || null
      });

      res.status(201).json({
        success: true,
        message: 'Tạo dịch vụ thành công',
        data: newService
      });
    } catch (error) {
      console.error('Error creating service:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi tạo dịch vụ mới'
      });
    }
  },

  // Lấy danh sách dịch vụ
  getAllServices: async (req, res) => {
    try {
      const whereClause = {};
      if (req.query.active === 'true') {
        whereClause.is_active = true;
      }
      
      const services = await Service.findAll({
        where: whereClause,
        include: [{ model: ServiceCategory, as: 'category' }],
        order: [['id', 'DESC']]
      });
      res.json({
        success: true,
        data: services
      });
    } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách dịch vụ'
      });
    }
  },

  // Cập nhật dịch vụ
  updateService: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, category_id, price, description, is_active, thumbnail } = req.body;

      const service = await Service.findByPk(id);
      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy dịch vụ'
        });
      }

      await service.update({
        name: name || service.name,
        category_id: category_id !== undefined ? category_id : service.category_id,
        price: price !== undefined ? price : service.price,
        description: description !== undefined ? description : service.description,
        is_active: is_active !== undefined ? is_active : service.is_active,
        thumbnail: thumbnail !== undefined ? thumbnail : service.thumbnail
      });

      // Fetch the updated service with category included
      const updatedService = await Service.findByPk(id, {
        include: [{ model: ServiceCategory, as: 'category' }]
      });

      res.json({
        success: true,
        message: 'Cập nhật dịch vụ thành công',
        data: updatedService
      });
    } catch (error) {
      console.error('Error updating service:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật dịch vụ'
      });
    }
  },

  // Lấy danh sách dịch vụ theo danh mục
  getServicesByCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const services = await Service.findAll({
        where: { category_id: categoryId, is_active: true },
        include: [{ model: ServiceCategory, as: 'category' }],
        order: [['id', 'DESC']]
      });
      res.json({
        success: true,
        data: services
      });
    } catch (error) {
      console.error('Error fetching services by category:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách dịch vụ theo danh mục'
      });
    }
  },

  // Lấy chi tiết dịch vụ
  getServiceById: async (req, res) => {
    try {
      const { id } = req.params;
      const service = await Service.findOne({
        where: { id: id, is_active: true },
        include: [{ model: ServiceCategory, as: 'category' }]
      });

      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy dịch vụ'
        });
      }

      res.json({
        success: true,
        data: service
      });
    } catch (error) {
      console.error('Error fetching service details:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy chi tiết dịch vụ'
      });
    }
  }
};

module.exports = serviceController;

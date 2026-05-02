const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Router dành cho Shipper
// Lấy danh sách đơn được phân công
router.get('/my-orders', protect, authorizeRoles('ROLE_SHIPPER'), shippingController.getMyAssignedOrders);

// Cập nhật trạng thái đơn (đã lấy, giao thành công, thất bại)
router.put('/:orderId/status', protect, authorizeRoles('ROLE_SHIPPER'), shippingController.updateShippingStatus);

module.exports = router;

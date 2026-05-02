const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// 1. Tạo đơn hàng mới (POST /api/orders)
// Mở cho khách hàng hoặc auth tuỳ thiết kế, ở đây tạm giữ nguyên
router.post('/', orderController.createOrder);

// Tạo đơn hàng tại quầy (POS)
router.post('/staff', protect, authorizeRoles('ROLE_ADMIN', 'ROLE_DIRECTOR', 'ROLE_SALES_STAFF'), orderController.createStaffOrder);

// 2. Lấy tất cả đơn hàng cho Admin
router.get('/', protect, authorizeRoles('ROLE_DIRECTOR', 'ROLE_ORDER_MANAGER', 'ROLE_CASHIER'), orderController.getAllOrders);

// 3. Lấy đơn hàng của 1 user cụ thể
router.get('/user/:userId', protect, orderController.getOrdersByUser);

// 4. Lấy chi tiết 1 đơn hàng
router.get('/:id', protect, orderController.getOrderById);

// Khách hàng tự hủy đơn hàng
router.put('/:id/cancel', protect, orderController.cancelOrder);

// 5. Cập nhật trạng thái đơn hàng (Có lưu vết lịch sử)
router.put('/:id', protect, authorizeRoles('ROLE_DIRECTOR', 'ROLE_ORDER_MANAGER', 'ROLE_CASHIER'), orderController.updateOrderStatus);

// 6. Lấy lịch sử 1 đơn hàng
router.get('/:id/history', protect, authorizeRoles('ROLE_DIRECTOR', 'ROLE_ORDER_MANAGER', 'ROLE_CASHIER'), orderController.getOrderHistories);

// 7. Gán Shipper
router.put('/:id/assign', protect, authorizeRoles('ROLE_DIRECTOR', 'ROLE_ORDER_MANAGER'), orderController.assignShipper);

module.exports = router;
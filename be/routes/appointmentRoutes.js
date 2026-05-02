const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Chỉ user đã đăng nhập mới được đặt lịch và lấy lịch sử của mình
router.post('/', protect, appointmentController.createAppointment);
router.get('/my-appointments', protect, appointmentController.getUserAppointments);

// Các Role thao tác
const AT_ROLES = ['ROLE_DIRECTOR', 'ROLE_ORDER_MANAGER', 'ROLE_CASHIER', 'ROLE_TECHNICAL_STAFF'];
router.get('/', protect, authorizeRoles(...AT_ROLES), appointmentController.getAllAppointments);
router.put('/:id', protect, authorizeRoles(...AT_ROLES), appointmentController.updateAppointment);
router.get('/:id/history', protect, authorizeRoles(...AT_ROLES), appointmentController.getAppointmentHistories);

module.exports = router;

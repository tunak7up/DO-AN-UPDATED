// routes/inventoryRoutes.js
const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const INV_ROLES = ['ROLE_DIRECTOR', 'ROLE_WAREHOUSE_MANAGER', 'ROLE_ADMIN', 'ROLE_SALES_STAFF'];
// GET /api/inventory/ - Lấy toàn bộ tồn kho
router.get('/', protect, authorizeRoles(...INV_ROLES), inventoryController.getAllInventory);

// PUT /api/inventory/quick-update/:productId/:storeId - Cập nhật nhanh tồn kho
router.put('/quick-update/:productId/:storeId', protect, authorizeRoles('ROLE_DIRECTOR', 'ROLE_WAREHOUSE_MANAGER', 'ROLE_ADMIN'), inventoryController.updateInventoryQuantity);

// GET /api/inventory/history/:productId - Lấy lịch sử cập nhật tồn kho
router.get('/history/:productId', protect, authorizeRoles(...INV_ROLES), inventoryController.getProductInventoryHistory);

module.exports = router;
const express = require('express');
const router = express.Router();
const importController = require('../controllers/importController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Chỉ Admin, Director, Warehouse Manager được quyền tạo phiếu nhập
const IMPORT_ROLES = ['ROLE_ADMIN', 'ROLE_DIRECTOR', 'ROLE_WAREHOUSE_MANAGER'];

// Tạo phiếu nhập
router.post('/', protect, authorizeRoles(...IMPORT_ROLES), importController.createImportReceipt);

module.exports = router;

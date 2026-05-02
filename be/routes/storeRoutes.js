const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/stores/my-stores - Lấy các cửa hàng mà user có quyền truy cập
router.get('/my-stores', protect, storeController.getMyStores);

// GET /api/stores - Lấy tất cả cửa hàng
router.get('/', storeController.getAllStores);

module.exports = router;
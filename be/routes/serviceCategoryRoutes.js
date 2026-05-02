const express = require('express');
const router = express.Router();
const serviceCategoryController = require('../controllers/serviceCategoryController');

router.get('/', serviceCategoryController.getAllCategories);

module.exports = router;

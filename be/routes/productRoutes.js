const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Routes cho Product
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/category/:categoryId', productController.getProductsByCategory);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
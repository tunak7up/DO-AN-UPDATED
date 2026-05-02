const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Routes cho Cart
router.get('/user/:userId', cartController.getCartByUser);
router.post('/add', cartController.addToCart);
router.put('/item/:itemId', cartController.updateCartItem);
router.delete('/item/:itemId', cartController.removeFromCart);
router.delete('/user/:userId/clear', cartController.clearCart);

module.exports = router;
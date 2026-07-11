const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const cartController = require("../controllers/cartController");

// Routes cho Cart
router.get("/user/:userId", protect, cartController.getCartByUser);
router.post("/add", protect, cartController.addToCart);
router.put("/item/:itemId", protect, cartController.updateCartItem);
router.delete("/item/:itemId", protect, cartController.removeFromCart);
router.delete("/user/:userId/clear", protect, cartController.clearCart);

module.exports = router;

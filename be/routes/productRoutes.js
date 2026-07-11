const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Routes cho Product
const AT_ROLES = ["ROLE_DIRECTOR"];

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.get("/category/:categoryId", productController.getProductsByCategory);
router.post(
  "/",
  protect,
  authorizeRoles(...AT_ROLES),
  productController.createProduct,
);
router.put(
  "/:id",
  protect,
  authorizeRoles(...AT_ROLES),
  productController.updateProduct,
);
router.patch(
  "/:id/status",
  protect,
  authorizeRoles(...AT_ROLES),
  productController.toggleProductStatus,
);
router.delete(
  "/:id",
  protect,
  authorizeRoles(...AT_ROLES),
  productController.deleteProduct,
);

module.exports = router;

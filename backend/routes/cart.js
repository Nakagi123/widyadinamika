const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, getCart);
router.post("/", authMiddleware, addToCart);
router.patch("/:productId", authMiddleware, updateCartItem);
router.delete("/clear", authMiddleware, clearCart);
router.delete("/:productId", authMiddleware, removeCartItem);

module.exports = router;
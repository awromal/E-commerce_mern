const express = require("express");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controller/cart.controller.js");
const { protectUser } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/", protectUser, getCart);
router.post("/", protectUser, addToCart);
router.put("/:productId", protectUser, updateCartItem);
router.delete("/clear", protectUser, clearCart);
router.delete("/:productId", protectUser, removeFromCart);

module.exports = router;

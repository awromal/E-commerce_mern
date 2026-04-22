const Cart = require("../models/cart.model.js");
const Product = require("../models/product.model.js");

// @route  GET /api/cart
// @access Private (user)
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      "items.productId",
      "name price image category"
    );

    if (!cart) {
      return res.json({ success: true, data: { items: [] } });
    }

    res.json({ success: true, data: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching cart" });
  }
};

// @route  POST /api/cart
// @access Private (user)
const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return res.status(400).json({ success: false, message: "Product ID is required" });
  }

  try {
    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      // First item — create a new cart
      cart = await Cart.create({
        userId: req.user._id,
        items: [{ productId, quantity }],
      });
    } else {
      // Check if item already exists
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      await cart.save();
    }

    // Return populated cart
    const populatedCart = await Cart.findOne({ userId: req.user._id }).populate(
      "items.productId",
      "name price image category"
    );

    res.json({ success: true, data: populatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error adding to cart" });
  }
};

// @route  PUT /api/cart/:productId
// @access Private (user)
const updateCartItem = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) {
    return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
  }

  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not in cart" });
    }

    item.quantity = quantity;
    await cart.save();

    const populatedCart = await Cart.findOne({ userId: req.user._id }).populate(
      "items.productId",
      "name price image category"
    );

    res.json({ success: true, data: populatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating cart item" });
  }
};

// @route  DELETE /api/cart/:productId
// @access Private (user)
const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    await cart.save();

    const populatedCart = await Cart.findOne({ userId: req.user._id }).populate(
      "items.productId",
      "name price image category"
    );

    res.json({ success: true, data: populatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error removing cart item" });
  }
};

// @route  DELETE /api/cart
// @access Private (user)
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user._id });
    res.json({ success: true, data: { items: [] } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error clearing cart" });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };

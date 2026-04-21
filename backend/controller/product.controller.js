const Product = require("../models/product.model.js");
const mongoose = require("mongoose");

// 1. Removed 'export' from all functions
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Server Error: Failed to fetch products",
      });
  }
};

const createProduct = async (req, res) => {
  const product = req.body;

  if (
    !product.name ||
    !product.price ||
    !product.description ||
    !product.image
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const newProduct = new Product(product);

  try {
    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error creating product:", error.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Server Error: Failed to create product",
      });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Server Error: Failed to delete product",
      });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid product ID" });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Server Error: Failed to update product",
      });
  }
};

// 2. Exported EVERYTHING inside a single object
module.exports = {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
};

const express = require("express");
const moongoose = require("mongoose");

const Product = require("../models/product.model.js");
const { getProducts, createProduct, deleteProduct, updateProduct } = require("../controller/product.controller.js");
const upload = require("../config/multer.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/", getProducts);

// Use multer middleware to handle a single file upload in the 'image' field
router.post("/", protect, upload.single("image"), createProduct);

router.delete("/:id", protect, deleteProduct);

// Use multer middleware to handle a single file upload in the 'image' field for updating
router.put("/:id", protect, upload.single("image"), updateProduct);

module.exports = router;

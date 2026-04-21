const express = require("express");
const moongoose = require("mongoose");

const Product = require("../models/product.model.js");
const { getProducts } = require("../controller/product.controller.js");
const { createProduct } = require("../controller/product.controller.js");
console.log("Is getProducts a function?", typeof getProducts);
const { deleteProduct } = require("../controller/product.controller.js");
const { updateProduct } = require("../controller/product.controller.js");
const router = express.Router();

router.get("/", getProducts);

router.post("/", createProduct);

router.delete("/:id", deleteProduct);

router.put("/:id", updateProduct);

module.exports = router;

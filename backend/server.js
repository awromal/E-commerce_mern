const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
// 1. Explicitly import the connectDB function
const connectDB = require("./config/db.js");
const Product = require("./models/product.model.js");
const productRoutes = require("./routes/product.routes.js");

const app = express();

// 2. Use the environment variable port if available, otherwise default to 3000
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON data
app.use(express.json());

app.use("/api/products", productRoutes);

// Start the server and connect to the database
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running at http://localhost:${PORT}`);
});

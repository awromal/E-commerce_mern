const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db.js");
const productRoutes = require("./routes/product.routes.js");
const adminRoutes = require("./routes/admin.routes.js");

const path = require("path");

const app = express();

// 2. Use the environment variable port if available, otherwise default to 5000
const PORT = process.env.PORT || 5000;

// Middleware to parse incoming JSON data
app.use(express.json());
app.use(cors());

// Serve uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);

// Start the server and connect to the database
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running at http://localhost:${PORT}`);
});

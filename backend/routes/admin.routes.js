const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/admin.model.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

// @route   POST /api/admin/login
// @desc    Auth user & get token
// @access  Public
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Please provide username and password" });
  }

  // 1. Check securely against ENV file logic first (Superuser)
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { id: "admin_superuser", username },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    return res.json({ success: true, data: { username, token } });
  }

  // 2. If not superuser, check MongoDB for a dynamically created sub-admin
  try {
    const admin = await Admin.findOne({ username });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      const token = jwt.sign(
        { id: admin._id, username: admin.username },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );
      return res.json({ success: true, data: { username: admin.username, token } });
    } else {
      return res.status(401).json({ success: false, message: "Invalid Admin Credentials" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error during authentication" });
  }
});

// @route   POST /api/admin/register
// @desc    Register a new secondary admin
// @access  Private (Needs superadmin or an existing admin)
router.post("/register", protect, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Please provide all required fields" });
  }

  try {
    // Check if sub-admin or env-admin overlaps
    if (username === process.env.ADMIN_USERNAME) {
      return res.status(400).json({ success: false, message: "Username reserved for superuser" });
    }

    const adminExists = await Admin.findOne({ username });
    if (adminExists) {
      return res.status(400).json({ success: false, message: "Sub-Admin username already exists" });
    }

    // Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await Admin.create({
      username,
      password: hashedPassword
    });

    if (admin) {
      res.status(201).json({
        success: true,
        data: {
          _id: admin._id,
          username: admin.username
        }
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid sub-admin data payload" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error making admin" });
  }
});

module.exports = router;

const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

// Protect admin routes
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Not authorized, token failed" });
  }
};

// Protect user routes — attaches full user document to req.user
const protectUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Must be a regular user token (role: 'user')
    if (decoded.role !== "user") {
      return res.status(403).json({ success: false, message: "Access denied: not a user token" });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "User account not found" });
    }

    req.user = user;
    return next();
  } catch (error) {
    console.error("protectUser error:", error.message);
    return res.status(401).json({ success: false, message: "Not authorized, token failed" });
  }
};

module.exports = { protect, protectUser };

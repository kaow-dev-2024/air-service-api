// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Check if authorization header is present
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  // The token is usually sent as "Bearer TOKEN"
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    const user = await User.findByPk(decoded.user_id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;

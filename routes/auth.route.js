// routes/auth.js
const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  me,
  refreshToken,
  changePassword,
  session,
} = require("../controllers/auth.controller");

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", me);
router.post("/refresh-token", refreshToken);
router.post("/change-password", changePassword);
router.get("/session/:id", session);

module.exports = router;

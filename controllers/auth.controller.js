// controllers/authController.js
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { Op, fn, col, where } = require("sequelize");
require("dotenv").config();

const ACCESS_TOKEN_EXPIRE = process.env.TOKEN_EXPIRE || "90d";
const REFRESH_TOKEN_EXPIRE = process.env.REFRESH_TOKEN_EXPIRE || "30d";

const getJwtSecret = () => process.env.JWT_SECRET;
const getRefreshSecret = () =>
  process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

const signAccessToken = (userId) =>
  jwt.sign({ user_id: userId }, getJwtSecret(), {
    expiresIn: ACCESS_TOKEN_EXPIRE,
  });

const signRefreshToken = (userId) =>
  jwt.sign({ user_id: userId, type: "refresh" }, getRefreshSecret(), {
    expiresIn: REFRESH_TOKEN_EXPIRE,
  });

const extractBearerToken = (req) => {
  const auth = req.headers.authorization || "";
  const parts = String(auth).trim().split(" ");
  if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) return null;
  return parts[1];
};

const register = async (req, res) => {
  const userData = req.body;

  // Basic validation
  if (!userData.username || !userData.password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    // Check if user exists
    const existingUser = await User.findOne({
      where: { username: userData.username },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Username already taken" });
    }

    const userCreated = await User.create(userData);
    if (userCreated) {
      return res.status(200).json({ message: "Created Successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { password } = req.body;
  const rawLogin = req.body.login ?? req.body.username ?? req.body.email;
  const loginValue = typeof rawLogin === "string" ? rawLogin.trim() : "";
  const normalizedLogin = loginValue.toLowerCase();

  // Basic validation
  if (!loginValue || !password) {
    return res
      .status(400)
      .json({ message: "Login (username/email) and password are required" });
  }

  try {
    if (!getJwtSecret()) {
      return res.status(500).json({ message: "JWT_SECRET is not configured" });
    }

    // Find user by login field (compatible with username/email payloads)
    const user = await User.findOne({
      where: {
        is_active: true,
        [Op.or]: [
          where(fn("lower", col("username")), normalizedLogin),
          where(fn("lower", col("email")), normalizedLogin),
        ],
      },
      include: { all: true },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.validPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT
    const token = signAccessToken(user.user_id);
    const refresh_token = signRefreshToken(user.user_id);

    const userData = user.toJSON();
    delete userData.password;
    return res.status(200).json({
      token,
      refresh_token,
      token_type: "Bearer",
      expires_in: ACCESS_TOKEN_EXPIRE,
      refresh_expires_in: REFRESH_TOKEN_EXPIRE,
      user: userData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
const logout = async (req, res) => {
  // Stateless JWT logout:
  // server has no session to destroy, client should remove token locally.
  const auth = req.headers.authorization || "";
  const hasBearerToken =
    typeof auth === "string" && /^Bearer\s+\S+$/i.test(auth.trim());

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
    token_cleared_client_side: true,
    had_bearer_token: hasBearerToken,
  });
};
const me = async (req, res) => {
  const token = extractBearerToken(req);
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, getJwtSecret());

    const user = await User.findOne({
      where: { user_id: decoded.user_id, is_active: true },
      include: { all: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = user.toJSON();
    delete userData.password;
    return res.status(200).json({ user: userData });
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const refreshToken = async (req, res) => {
  const refreshTokenValue = req.body.refresh_token || req.body.refreshToken;
  if (!refreshTokenValue) {
    return res.status(400).json({ message: "refresh_token is required" });
  }

  try {
    const decoded = jwt.verify(refreshTokenValue, getRefreshSecret());
    const user = await User.findOne({
      where: { user_id: decoded.user_id, is_active: true },
      include: { all: true },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const token = signAccessToken(user.user_id);
    const refresh_token = signRefreshToken(user.user_id);
    const userData = user.toJSON();
    delete userData.password;

    return res.status(200).json({
      token,
      refresh_token,
      token_type: "Bearer",
      expires_in: ACCESS_TOKEN_EXPIRE,
      refresh_expires_in: REFRESH_TOKEN_EXPIRE,
      user: userData,
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

const changePassword = async (req, res) => {
  const token = extractBearerToken(req);
  if (!token) return res.status(401).json({ message: "No token" });

  const { old_password, new_password } = req.body;
  if (!old_password || !new_password) {
    return res
      .status(400)
      .json({ message: "old_password and new_password are required" });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    const user = await User.findOne({
      where: { user_id: decoded.user_id, is_active: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.validPassword(old_password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    user.password = new_password;
    await user.save();

    return res.status(200).json({ message: "Updated Password Successfully" });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const session = async (req, res) => {
  const token = extractBearerToken(req);
  if (!token) return res.status(401).json({ message: "No token" });

  const { id } = req.params;
  try {
    jwt.verify(token, getJwtSecret());
    const user = await User.findOne({
      where: { user_id: id, is_active: true },
      include: { all: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = user.toJSON();
    delete userData.password;
    return res.status(200).json({ active: true, user: userData });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = {
  register,
  login,
  logout,
  me,
  refreshToken,
  changePassword,
  session,
};

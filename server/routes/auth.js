const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
require("dotenv").config();

const router = express.Router();

/**
 * Helper function to generate JWT
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

/**
 * Signup Route
 */
router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);

      user = new User({ name, email, password: hashedPassword });
      await user.save();

      res.status(201).json({
        msg: "User registered successfully",
        token: generateToken(user._id),
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * Login Route
 */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

      res.json({ token: generateToken(user._id) });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * Get Profile Route (Protected)
 */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Update Profile Route (Protected)
 */
router.put(
  "/profile",
  authMiddleware,
  [
    body("email").optional().isEmail().withMessage("Valid email is required"),
    body("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ msg: "User not found" });

      if (name) user.name = name;
      if (email) user.email = email;
      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }

      await user.save();

      res.json({
        msg: "Profile updated successfully",
        token: generateToken(user._id), // return updated token
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;

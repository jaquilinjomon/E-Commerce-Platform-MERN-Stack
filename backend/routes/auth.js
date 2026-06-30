const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    const newUser = new User({
      username,
      email,
      password,  
      role: role || "user"
    });

    await newUser.save();

    // Generate JWT
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      msg: "Signup successful",
      token,
      role: newUser.role
    });
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ msg: "Server error during signup", error: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Compare password (hashed in schema)
    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      msg: "Login successful",
      token,
      role: user.role
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ msg: "Server error during login", error: err.message });
  }
});

module.exports = router;

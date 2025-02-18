const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
    const { name, email, password, confirmPassword, role } = req.body;
  
    if (!name || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword, role });
      await newUser.save();
      res.json({ message: "Registration successful!" });
    } catch (error) {
      res.status(500).json({ error: "Registration failed. Try again." });
    }
  });
  
// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, "jwtsecret", { expiresIn: "1h" });

    res.json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: "Login failed. Try again." });
  }
});

module.exports = router;

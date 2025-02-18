const express = require("express");
const router = express.Router();
const Car = require("../models/Car"); // Import Car Model

// API to Fetch Car Data
router.get("/cars", async (req, res) => {
  try {
    const cars = await Car.find(); // Fetch All Cars from MongoDB
    if (cars.length === 0) {
      return res.status(404).json({ message: "No cars available" });
    }
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cars" });
  }
});

module.exports = router;

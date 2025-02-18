const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  brand: String,
  model: String,
  fuel: String,
  transmission: String,
  pricePerDay: Number,
  pricePerHour: Number,
  image: String,
});

module.exports = mongoose.model("Car", CarSchema);

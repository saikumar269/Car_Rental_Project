// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/car-rental', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Models
const User = require('./models/User');
const Car = require('./models/Car');
const Booking = require('./models/Booking');

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/cars', require('./routes/carRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

// Register User
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    if (!name || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ message: "Registration successful!", token });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});



// Login User
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

app.post('/api/cars/filter', async (req, res) => {
  const { brand, fuelType, transmission, seater } = req.body;
  try {
    const filters = {};
    if (brand) filters.brand = new RegExp(brand, "i"); // Case-insensitive search
    if (fuelType) filters.fuelType = fuelType;
    if (transmission) filters.transmission = transmission;
    if (seater) filters.seater = seater;

    const filteredCars = await Car.find(filters);
    res.json(filteredCars);
  } catch (error) {
    res.status(500).json({ message: 'Error filtering cars', error });
  }
});


// Add Car
app.post('/api/cars', async (req, res) => {
  const { brand, model, seater, fuelType, transmission, pricePerHour, pricePerDay, mileage, image, ownerId } = req.body;

  try {
    const newCar = new Car({
      brand,
      model,
      seater,
      fuelType,
      transmission,
      pricePerHour,
      pricePerDay,
      mileage,
      image,
      ownerId,
    });
    await newCar.save();
    res.status(201).json({ message: 'Car added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding car', error });
  }
});

// Get All Cars
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cars data', error });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

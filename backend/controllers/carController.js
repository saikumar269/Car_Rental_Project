const Car = require('../models/Car');

// Fetch all cars
const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find(); // Fetch all cars
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cars data', error });
  }
};

// Add a new car (for providers)
const addCar = async (req, res) => {
  const { brand, model, seater, fuelType, transmissionType, pricePerHour, pricePerDay, mileage, image, provider } = req.body;

  try {
    const newCar = new Car({
      brand,
      model,
      seater,
      fuelType,
      transmissionType,
      pricePerHour,
      pricePerDay,
      mileage,
      image,
      provider, // ID of the user (provider) adding the car
    });

    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (error) {
    res.status(500).json({ message: 'Error adding car', error });
  }
};

module.exports = { getAllCars, addCar };

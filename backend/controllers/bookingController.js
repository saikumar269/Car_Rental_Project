const Booking = require('../models/Booking');

// Create a booking
const createBooking = async (req, res) => {
  const { carId, userId, paymentDetails, bookingDate } = req.body;

  try {
    const booking = new Booking({
      car: carId,
      user: userId,
      paymentDetails,
      bookingDate,
    });

    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error });
  }
};

// Get all bookings for a user
const getBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId }).populate('car');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error });
  }
};

module.exports = { createBooking, getBookingsByUser };

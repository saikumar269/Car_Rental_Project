const Booking = require('../models/Booking');
const Car = require('../models/Car');

// Process payment
const processPayment = async (req, res) => {
  const { userId, carId, paymentDetails, bookingDate } = req.body;

  try {
    // Create a booking after payment
    const booking = new Booking({
      user: userId,
      car: carId,
      paymentDetails,
      bookingDate,
    });

    const savedBooking = await booking.save();

    res.status(201).json({
      message: 'Payment processed successfully and booking confirmed',
      booking: savedBooking,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing payment', error });
  }
};

module.exports = { processPayment };

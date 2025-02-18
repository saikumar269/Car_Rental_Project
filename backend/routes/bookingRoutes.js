const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { createBooking, getBookingsByUser } = require('../controllers/bookingController');

// Create a new booking
router.post('/', protect, createBooking);

// Get bookings for a user
router.get('/:userId', protect, getBookingsByUser);

module.exports = router;

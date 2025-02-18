const express = require('express');
const router = express.Router();
const { processPayment } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

// Process payment
router.post('/', protect, processPayment);

module.exports = router;

const router = require('express').Router();
const { createBooking, getMyBookings } = require('../controllers/bookingController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, createBooking);
router.get('/mine', verifyToken, getMyBookings);

module.exports = router;

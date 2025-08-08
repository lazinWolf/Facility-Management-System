const router = require('express').Router();
const { getFacilities, createFacility } = require('../controllers/facilityController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Resident Routes
router.get('/', verifyToken, getFacilities);

// Admin Routes
router.post('/', verifyToken, isAdmin, createFacility);

module.exports = router;

const router = require('express').Router();
const { getFacilities, createFacility } = require('../controllers/facilityController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, getFacilities);
router.post('/', verifyToken, isAdmin, createFacility);

module.exports = router;

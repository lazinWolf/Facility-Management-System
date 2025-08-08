const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const { getDashboardData } = require('../controllers/dashboardController');

// Protect the dashboard route
router.get('/', verifyToken, isAdmin, getDashboardData);

module.exports = router;
const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const { getResidents, updateResident, deleteResident } = require('../controllers/adminController');

// All routes in this file are protected and for admins only
router.use(verifyToken);
router.use(isAdmin);

// @route   GET /api/admin/residents
// @desc    Get a list of all residents
router.get('/residents', getResidents);

// @route   PUT /api/admin/residents/:id
// @desc    Update a specific resident's information
router.put('/residents/:id', updateResident);

// @route   DELETE /api/admin/residents/:id
// @desc    Delete a specific resident
router.delete('/residents/:id', deleteResident);

module.exports = router;
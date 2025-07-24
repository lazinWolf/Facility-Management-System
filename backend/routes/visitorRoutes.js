const express = require('express');
const router = express.Router();
const {
  createVisitor,
  getMyVisitors,
  getAllVisitors,
  approveVisitor
} = require('../controllers/visitorController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Resident routes
router.post('/', verifyToken, createVisitor);
router.get('/mine', verifyToken, getMyVisitors);

// Admin routes
router.get('/', verifyToken, isAdmin, getAllVisitors);
router.put('/:id/approve', verifyToken, isAdmin, approveVisitor);

module.exports = router;

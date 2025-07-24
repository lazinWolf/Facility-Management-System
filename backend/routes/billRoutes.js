const express = require('express');
const router = express.Router();
const {
  getMyBills,
  getAllBills,
  createBill,
  updateBill,
  deleteBill,
  payBill
} = require('../controllers/billController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Resident routes
router.get('/mine', verifyToken, getMyBills);
router.post('/pay/:id', verifyToken, payBill);

// Admin routes
router.get('/', verifyToken, isAdmin, getAllBills);
router.post('/', verifyToken, isAdmin, createBill);
router.put('/:id', verifyToken, isAdmin, updateBill);
router.delete('/:id', verifyToken, isAdmin, deleteBill);

module.exports = router;

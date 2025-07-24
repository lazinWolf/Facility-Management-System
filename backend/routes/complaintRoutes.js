const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getUserComplaints,
  getAllComplaints,
  updateComplaintStatus
} = require('../controllers/complaintController');

const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, createComplaint);
router.get('/mine', verifyToken, getUserComplaints);
router.get('/', verifyToken, isAdmin, getAllComplaints);
router.put('/:id', verifyToken, isAdmin, updateComplaintStatus);

module.exports = router;

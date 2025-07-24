const router = require('express').Router();
const {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement
} = require('../controllers/announcementController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// All authenticated users can view
router.get('/', verifyToken, getAnnouncements);

// Admin only: create & delete
router.post('/', verifyToken, isAdmin, createAnnouncement);
router.delete('/:id', verifyToken, isAdmin, deleteAnnouncement);

module.exports = router;

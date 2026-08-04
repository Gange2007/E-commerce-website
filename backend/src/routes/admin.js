const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, updateUser, deleteUser } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;

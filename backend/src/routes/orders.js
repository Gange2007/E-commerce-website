const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);

router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrder);

// Admin routes
router.get('/', adminOnly, getAllOrders);
router.put('/:id/status', adminOnly, updateOrderStatus);

module.exports = router;

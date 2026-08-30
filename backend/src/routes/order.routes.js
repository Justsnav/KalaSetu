const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/order.controller');
const protect = require('../middleware/auth.middleware');
const restrictTo = require('../middleware/role.middleware');

router.post('/', protect, createOrder);
router.get('/', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.patch('/:id/status', protect, restrictTo('artisan'), updateOrderStatus);

module.exports = router;

const express = require("express");
const router = express.Router();

const orderController = require('../controllers/order.controllers');

router.get('/:userId', orderController.getOrders);
router.get('/:userId/:orderId', orderController.getOrderById);
router.post('/:userId', orderController.createOrder);
router.put('/:orderId', orderController.updateOrderStatus);

module.exports = router;
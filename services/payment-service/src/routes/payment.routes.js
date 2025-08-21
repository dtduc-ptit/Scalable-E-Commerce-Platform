const express = require("express");
const router = express.Router();

const paymentController = require('../controllers/payment.controller');

router.get('/:paymentId', paymentController.getPaymentById);
router.get('/order/:orderId', paymentController.getPaymentByOrderId);
router.post('/:orderId', paymentController.createPayment);

module.exports = router;
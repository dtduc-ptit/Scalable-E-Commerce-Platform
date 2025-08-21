const Payment = require('../models/payment.models');
const mongoose = require('mongoose');
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

const getPaymentById = async (req, res) => {
  const { paymentId } = req.params;

  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPaymentByOrderId = async (req, res) => {
  const { orderId } = req.params;

  try {
    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createPayment = async (req, res) => {
    const orderId = req.params.orderId;
    const { amount, paymentMethodId } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            payment_method: paymentMethodId,
            confirm: true
        });

        const payment = new Payment({
            orderId,
            amount,
            status: paymentIntent.status,
            paymentMethod: "stripe"
        });
        await payment.save();
        res.status(201).json(payment);
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    getPaymentById,
    getPaymentByOrderId,
    createPayment
};
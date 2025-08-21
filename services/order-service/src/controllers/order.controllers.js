const axios = require('axios');
require('dotenv').config();
const Order = require('../models/order.models');
const mongoose = require("mongoose");

const PRODUCT_SERVICE_URI = process.env.PRODUCT_SERVICE_URI

// Get all orders for a user
const getOrders = async (req, res) => {
    const userId = req.params.userId;
    try {
        const orders = await Order.find({ userId });
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this user." });
        }
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getOrderById = async (req, res) => {
    const userId = req.params.userId;
    const orderId = req.params.orderId;
    try {
        const order = await Order.findOne({ _id: orderId, userId });
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createOrder = async (req, res) => {
    const userId = req.params.userId;
    const { products, totalAmount } = req.body;

    try {
        const productChecks = await Promise.all(
            products.map(async (product) => {
                const productData = await axios.get(`${PRODUCT_SERVICE_URI}/${product.productId}`);
                return productData.data && productData.data.stock >= product.quantity;
            })
        );

        if (productChecks.includes(false)) {
            return res.status(400).json({ message: "One or more products are out of stock." });
        }

        const newOrder = new Order({
            userId,
            products,
            totalAmount
        });
        await newOrder.save();

        await Promise.all(
            products.map(async (product) => {
                await axios.put(`${PRODUCT_SERVICE_URI}/${product.productId}/deduct`, {
                    quantity: product.quantity
                });
            })
        );

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateOrderStatus = async (req, res) => {
    const orderId = req.params.orderId;
    const { status } = req.body;

    if( status !== 'pending' && status !== 'shipped' && status !== 'delivered' && status !== 'cancelled') {
        return res.status(400).json({ message: "Invalid order status." });
    }

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        order.status = status;
        await order.save();

        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
module.exports = {
    getOrders,
    getOrderById,
    createOrder,
    updateOrderStatus
};
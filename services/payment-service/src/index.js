const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');

const paymentRoutes = require('./routes/payment.routes');

app.use(cors());
app.use(express.json());
app.use('', paymentRoutes);

const PORT = process.env.PORT || 3005;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("Payment Service is Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Payment Service running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('Database connection error:', err);
});
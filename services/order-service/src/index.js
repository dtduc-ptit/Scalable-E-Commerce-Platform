const express = require('express');
const app = express();
require('dotenv').config();

const mongoose = require('mongoose');
const cors = require('cors');
const orderRoutes = require('./routes/order.routes');

app.use(cors());
app.use(express.json());

app.use('', orderRoutes);

const PORT = process.env.PORT || 3004;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Order Service is Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Order Service running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to Database -> Order Service", err);
  });

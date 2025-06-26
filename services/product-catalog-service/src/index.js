require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

const productRoutes = require('./routes/product.routes');

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 3002;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Product Service is Connected to MongoDB")
    app.listen(PORT, () => {
      console.log(`Product Catalog Service running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error("Failed to connect to Database -> Product Service", err)
  })
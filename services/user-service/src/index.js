require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const userRoutes = require('./routes/user.routes');

app.use(cors());
app.use(express.json());

app.use('', userRoutes); 

const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("User Service is Connected to MongoDB")
    app.listen(PORT, () => {
      console.log(`User Service running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error("Failed to connect to Database -> User Service", err)
  })
require('dotenv').config();
const express = require('express');
const app = express();
const notificationRoutes = require('./routes/notification.routes');

app.use(express.json());

app.use("", notificationRoutes);

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});
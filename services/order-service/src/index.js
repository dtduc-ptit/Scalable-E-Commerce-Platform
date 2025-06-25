const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});
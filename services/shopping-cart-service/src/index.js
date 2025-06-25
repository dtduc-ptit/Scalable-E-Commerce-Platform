require('dotenv').config();
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Shopping Cart Service running on port ${PORT}`);
});
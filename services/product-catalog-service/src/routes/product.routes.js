const express = require("express");
const router = express.Router();

const productController = require('../controllers/product.controllers');

router.get('/', productController.getAllProduct);
router.post('/', productController.createProduct);

module.exports = router;
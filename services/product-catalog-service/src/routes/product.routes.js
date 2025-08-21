const express = require("express");
const router = express.Router();

const productController = require('../controllers/product.controllers');

router.get('/', productController.getAllProduct);
router.post('/', productController.createProduct);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.removeProduct);
router.put('/:id/deduct', productController.deductProduct);

module.exports = router;
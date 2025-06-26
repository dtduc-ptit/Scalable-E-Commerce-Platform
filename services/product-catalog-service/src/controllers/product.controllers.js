const Product = require('../models/product.models');
const mongoose = require("mongoose");

const createProduct = async (req, res) => {
    const { name, description, price, category, stock } = req.body

    if (!name || !description || !price || !category) {
        return res.status(400).json({ message: 'Product includes name, description, price, category' });
    }

    try {
        const newProduct = new Product({
            name,
            description,
            price,
            category,
            stock,
        })
        await newProduct.save()
        res.status(201).json({message: 'Create Product Successful'});
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation Error'
            });
        }
        res.status(500).send({
          message: "Internal server error",
          error: err.message
        })
    }
}

const getAllProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const total = await Product.countDocuments();

    const products = await Product.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (products.length === 0) {
      return res.status(200).json({message: 'Product not found'});
    }

    res.status(200).json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      products,
    });
  } catch (err) {
    console.error('Error getting product list:', err);
    res.status(500).send({
      message: "Internal server error",
      error: err.message
    })
  }
};

const getProductById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      message: `Invalid product ID format: ${req.params.id}`
    });
  }

  try {
    const product = await Product.findById(req.params.id);
    if(!product) {
      return res.status(404).json({ message: `Product with ID ${req.params.id} not found`});
    }
    res.json(product);
  } catch(err) {
      console.error('Error getting product:', err);
      res.status(500).send({
        message: "Internal server error",
        error: err.message
      })
  }
}

const updateProduct = async (req, res) => {
  const { name, description, price, category, stock } = req.body;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: `Invalid product ID format: ${id}`
    });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, description, category, stock },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: `Product with ID ${id} not found`
      });
    }

    res.json({
      message: `Updated product with ID ${id} successfully`,
      data: updatedProduct
    });
  } catch (err) {
    console.error("Error update product:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message
    });
  }
};

const removeProduct = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      message: `Invalid product ID format: ${req.params.id}`
    });
  }
  try {
    const removeProduct = await Product.findByIdAndDelete(req.params.id);
    if(!removeProduct) {
      return res.status(404).json({ message: `Product with ID ${req.params.id} not found`});
    }
    res.json({message: `Product with ID ${req.params.id} deleted`})
  } catch(err) {
    console.error("Error update product:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message
    });
  }
}
module.exports = {
    getAllProduct,
    createProduct,
    getProductById,
    updateProduct,
    removeProduct
}
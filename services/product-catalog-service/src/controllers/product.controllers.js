const Product = require('../models/product.models');

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
        res.status(500).send("Internal server error")
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
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
    getAllProduct,
    createProduct
}
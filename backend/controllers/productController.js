const Product = require('../models/productModel');

// Get all products
exports.getAllProducts = async (_, res) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    message: 'All products fetched',
    products,
  });
};

// Create a product
exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    message: 'Product created',
    product,
  });
};

// Update a product
exports.updateProduct = async (req, res) => {
  const id = req.params.id;
  let product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  const up = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    usefindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: 'Product updated',
    product: up,
  });
};

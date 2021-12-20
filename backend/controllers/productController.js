const Product = require('../models/productModel');

// Get all products
exports.getAllProducts = (_, res) => {
  res.status(200).json({
    message: 'All products fetched',
  });
};

// Create a product
exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    message: 'Product created',
    product,
  });
};

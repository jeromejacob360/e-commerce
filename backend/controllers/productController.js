const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Get all products from the database
exports.getAllProducts = catchAsyncErrors(async (_, res) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    message: 'All products fetched',
    products,
  });
});

// Get a product by id
exports.getProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(
      new ErrorHandler(`Product not found with id of ${req.params.id}`, 404),
    );
  }
  res.status(200).json({
    success: true,
    message: 'Product fetched',
    product,
  });
});

// Create a product (admin only)
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    message: 'Product created',
    product,
  });
});

// Update a product (admin only)
exports.updateProduct = catchAsyncErrors(async (req, res) => {
  const id = req.params.id;
  let product = await Product.findById(id);
  if (!product) {
    return next(
      new ErrorHandler(`Product not found with id of ${req.params.id}`, 404),
    );
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
});

// Delete a product (admin only)
exports.deleteProduct = catchAsyncErrors(async (req, res) => {
  const id = req.params.id;
  let product = await Product.findById(id);
  if (!product) {
    return next(
      new ErrorHandler(`Product not found with id of ${req.params.id}`, 404),
    );
  }

  const dp = await Product.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: 'Product deleted',
    product: dp,
  });
});

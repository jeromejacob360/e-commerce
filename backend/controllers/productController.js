const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ApiFeatures = require('../utils/apiFeatures');

// Get all products from the database
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const productsCount = await Product.countDocuments();
  const limit = req.query.limit * 1 || 10;

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeature.query;
  const filteredProductsCount = products.length;

  apiFeature.paginate(limit);

  try {
    products = await apiFeature.query.clone();
  } catch (error) {
    console.log(error);
  }

  res.status(200).json({
    success: true,
    products,
    productsCount,
    filteredProductsCount,
    limit,
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
  req.body.createdBy = req.user.id;
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

// Add a product review
exports.addProductReview = catchAsyncErrors(async (req, res, next) => {
  const { productId, rating, comment } = req.body;

  const review = {
    userId: req.user.id,
    name: req.user.name,
    rating: rating * 1,
    comment,
  };

  const product = await Product.findById(productId);
  if (!product) return next(new ErrorHandler('Product not found', 400));

  const isReviewed =
    !!product.reviews.find((review) => review.userId === req.user.id) || false;

  if (isReviewed)
    product.reviews.forEach((review) => {
      if (review.userId.toString() === req.user.id) {
        review.rating = rating;
        review.comment = comment;
      }
    });
  else {
    product.reviews.push(review);
    product.numOfReviews = product.numOfReviews.length;
  }

  // Calculate overall rating
  const totalRating = product.reviews.reduce((acc, review) => {
    return acc + review.rating;
  }, 0);
  product.rating = (totalRating * 1) / product.reviews.length;
  await product.save({
    validateBeforeSave: true,
  });

  res.status(200).json({
    success: true,
    message: 'Product review added',
    product,
  });
});

// Get all reviews for a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product)
    return next(
      new ErrorHandler(`Product not found with id of ${req.params.id}`, 404),
    );

  res.status(200).json({
    success: true,
    message: 'Product reviews fetched',
    reviews: product.reviews,
  });
});

// Delete a review for a product (Admin only)
exports.deleteProductReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product)
    return next(
      new ErrorHandler(`Product not found with id of ${req.query.id}`, 404),
    );

  let reviews = product.reviews.filter(
    (review) => review._id.toString() === req.query.reviewId.toString(),
  );
  if (reviews.length === 0)
    return next(new ErrorHandler('Review not found', 404));

  product.reviews = product.reviews.filter(
    (review) => review._id !== req.query.reviewId,
  );
  product.numOfReviews = product.numOfReviews - 1;
  console.log(`numOfReviews`, product.numOfReviews);

  // Calculate overall rating
  if (product.numOfReviews === 0) product.rating = 0;
  else {
    const totalRating = product.reviews.reduce((acc, review) => {
      return acc + review.rating;
    }, 0);
    product.rating = (totalRating * 1) / product.reviews.length;
  }
  await product.save({
    validateBeforeSave: true,
    new: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: 'Product review deleted',
    product,
  });
});

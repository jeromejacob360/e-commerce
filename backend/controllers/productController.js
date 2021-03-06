const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const cloudinary = require('cloudinary');

// Get all products from the database
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  let { sort, limit, ...find } = req.query;
  sort = sort || '-numOfReviews price';
  if (sort === '-numOfReviews') {
    sort = '-numOfReviews price';
  }

  limit = limit || 10;

  const keyword = find.keyword
    ? [
        { description: { $regex: find.keyword, $options: 'i' } },
        { name: { $regex: find.keyword, $options: 'i' } },
      ]
    : null;
  const criteria = keyword ? { $or: keyword } : {};

  find = { ...find, ...criteria };

  const products = await Product.paginate(find, {
    sort,
    limit: parseInt(limit),
    page: req.query.page || 1,
  });

  res.status(200).json({
    success: true,
    products: products.docs,
    productsCount: products.total,
    limit: products.limit,
    totalPages: products.pages,
    currentPage: products.page,
  });
});

// Get all products (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
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
  const { images } = req.body;

  const urlArray = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i].url, {
      folder: `products`,
    });
    urlArray.push({
      url: result.secure_url,
      public_id: result.public_id,
    });
  }

  const newProduct = {
    ...req.body,
    images: urlArray,
    createdBy: req.user.id,
  };
  const product = await Product.create(newProduct);
  res.status(201).json({
    success: true,
    message: 'Product created',
    product,
  });
});

// Update a product (admin only)
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let product = await Product.findById(id);
  if (!product) {
    return next(
      new ErrorHandler(`Product not found with id of ${req.params.id}`, 404),
    );
  }

  const { oldImages, images } = req.body;

  if (oldImages.length > 0) {
    for (let i = 0; i < oldImages.length; i++) {
      await cloudinary.v2.uploader.destroy(oldImages[i].public_id);
    }
  }

  const urlArray = [];
  if (images.length > 0)
    for (let i = 0; i < images.length; i++) {
      if (images[i].public_id) {
        urlArray.push(images[i]);
      } else {
        const result = await cloudinary.v2.uploader.upload(images[i].url, {
          folder: `products`,
        });

        urlArray.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

  const updatedProduct = { ...req.body, images: urlArray };

  const up = await Product.findByIdAndUpdate(id, updatedProduct, {
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
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let product = await Product.findById(id);
  if (!product) {
    return next(
      new ErrorHandler(`Product not found with id of ${req.params.id}`, 404),
    );
  }

  // Delete images from cloudinary

  const { images } = product;
  for (let i = 0; i < images.length; i++) {
    await cloudinary.v2.uploader.destroy(images[i].public_id);
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
  const { productId, rating, reviewMessage, avatar } = req.body;

  const review = {
    userId: req.user.id,
    name: req.user.name,
    rating: rating * 1,
    reviewMessage,
    avatar,
  };

  const product = await Product.findById(productId);
  if (!product) return next(new ErrorHandler('Product not found', 400));

  try {
    const isReviewed =
      !!product.reviews.find((review) => {
        return review.userId.toString() === req.user.id;
      }) || false;

    if (isReviewed)
      product.reviews.forEach((review) => {
        if (review.userId.toString() === req.user.id) {
          review.rating = rating;
          review.reviewMessage = reviewMessage;
        }
      });
    else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
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
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Get all reviews for a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product)
    return next(
      new ErrorHandler(`Product not found with id of ${req.query.id}`, 404),
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

  let review = product.reviews.filter(
    (review) => review._id.toString() === req.query.reviewId.toString(),
  )[0];

  if (review.length === 0) {
    return next(new ErrorHandler('Review not found', 404));
  }

  if (req.user._id.toString() !== review.userId.toString()) {
    if (req.user.role !== 'admin') {
      return next(new ErrorHandler("You cannot delete other's review", 405));
    }
  }

  product.reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.query.reviewId,
  );
  product.numOfReviews = product.numOfReviews - 1;

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

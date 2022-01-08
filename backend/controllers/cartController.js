const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ApiFeatures = require('../utils/apiFeatures');

// Add a product to the cart
exports.addProductToCart = catchAsyncErrors(async (req, res, next) => {
  const { productId, quantity } = req.body;

  const data = await Product.findById(productId);

  const productToCart = {
    productId: data._id,
    name: data.name,
    price: data.price,
    image: data.images[0],
    stock: data.stock,
    quantity,
  };

  const cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) {
    const newCart = new Cart({
      userId: req.user.id,
      items: [productToCart],
    });
    await newCart.save();
    return res.status(201).json({
      success: true,
      message: 'Product added to cart',
      cart: newCart.items,
    });
  }
  const product = cart.items.find(
    (item) => item.productId.toString() === productToCart.productId.toString(),
  );
  if (product) {
    product.quantity += quantity;
    await cart.save();
    return res.status(201).json({
      success: true,
      message: 'Product added to cart',
      cart: cart.items,
    });
  }

  console.log('Not found');
  cart.items.push(productToCart);
  await cart.save();
  return res.status(201).json({
    success: true,
    message: 'Product added to cart',
    cart: cart.items,
  });
});

exports.removeFromCart = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.body;
  const cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) {
    return next(new ErrorHandler(404, 'Cart not found'));
  }

  const product = cart.items.find(
    (item) => item.productId.toString() === productId,
  );
  if (!product) {
    return next(new ErrorHandler(404, 'Product not found'));
  }

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId,
  );
  await cart.save();
  return res.status(201).json({
    success: true,
    message: 'Product removed from cart',
    cart: cart.items,
  });
});

// Get the cart
exports.getCart = catchAsyncErrors(async (req, res, next) => {
  const cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) {
    res.status(200).json({
      success: true,
      message: 'Cart is empty',
      cart: [],
    });
  }

  res.status(200).json({
    success: true,
    cart: cart.items,
  });
});

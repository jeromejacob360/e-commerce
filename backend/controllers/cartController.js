const Cart = require('../models/cartModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ApiFeatures = require('../utils/apiFeatures');

// Add a product to the cart
exports.addProductToCart = catchAsyncErrors(async (req, res, next) => {
  const { product: productToCart, quantity } = req.body;

  const cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) {
    const newCart = new Cart({
      userId: req.user.id,
      items: [
        {
          productId: productToCart._id,
          quantity,
          productDetails: productToCart,
        },
      ],
    });
    await newCart.save();
    return res.status(201).json({
      success: true,
      message: 'Product added to cart',
      cart: newCart.items,
    });
  }

  const product = cart.items.find(
    (item) => item.productId.toString() === productToCart._id,
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

  cart.items.push({
    productId: productToCart._id,
    quantity,
    productDetails: productToCart,
  });
  await cart.save();
  return res.status(201).json({
    success: true,
    message: 'Product added to cart',
    cart,
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

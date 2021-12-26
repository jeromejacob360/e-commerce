const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Create new order
exports.createOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: 'Order created',
    order,
  });
});

// Get single order
exports.getOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    '-password',
    '-role',
  );

  if (!order) {
    return next(new ErrorHandler(404, 'Order not found'));
  }

  res.status(200).json({
    success: true,
    message: 'Order retrieved',
    order,
  });
});

// Get logged in user's orders
exports.getUserOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id }).populate(
    'user',
    '-password',
    '-role',
  );

  if (!orders) {
    return next(new ErrorHandler(404, 'Orders not found'));
  }

  res.status(200).json({
    success: true,
    message: 'Orders retrieved',
    orders,
  });
});

// Get all orders (admin only)
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find().populate('user', '-password', '-role');

  if (!orders) {
    return next(new ErrorHandler(404, 'Orders not found'));
  }

  // Find total order amount
  const totalAmount = orders.reduce((acc, order) => {
    return acc + order.totalPrice;
  }, 0);

  res.status(200).json({
    success: true,
    message: 'Orders retrieved',
    orders,
    totalAmount,
  });
});

// Update order status
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler(404, 'Order not found'));
  }
  if (order.status === 'Delivered') {
    return next(new ErrorHandler(400, 'Order already delivered'));
  }

  // Update stock
  if (req.body.status === 'Shipped') {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  order.orderStatus = req.body.status;

  if (req.body.status === 'Delivered') {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.Stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

// Delete order
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler(404, 'Order not found'));
  }

  await order.remove();
  res.status(200).json({
    success: true,
    message: 'Order deleted',
  });
});

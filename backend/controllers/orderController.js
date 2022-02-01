const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Create new order
exports.createOrder = catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      shippingInfo,
      orderItems,
      itemsPrice,
      discount,
      shippingPrice,
      totalPrice,
      paymentInfo,
    } = req.body;

    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      discount,
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
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

// Get single order
exports.getOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }

  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorHandler('You can view your order only', 405));
  }

  res.status(200).json({
    success: true,
    message: 'Order retrieved',
    order,
  });
});

// Get logged in user's orders
exports.getUserOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id }).populate('user');

  if (!orders) {
    return next(new ErrorHandler('Orders not found', 404));
  }

  res.status(200).json({
    success: true,
    message: orders.length + ' Orders retrieved',
    orders,
  });
});

// Get all orders (admin only)
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find().populate('user', '-role');

  if (!orders) {
    return next(new ErrorHandler('Orders not found', 404));
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
    return next(new ErrorHandler('Order not found', 404));
  }
  if (order.status === 'Delivered') {
    return next(new ErrorHandler('Order already delivered', 400));
  }

  // Update stock
  if (req.body.orderStatus === 'Processing') {
    order.orderItems.forEach(async (orderItem) => {
      await updateStock(orderItem.productId.toString(), orderItem.quantity);
    });
  }
  order.orderStatus = req.body.orderStatus;

  order.orderItems.forEach(async (orderItem) => {
    if (
      orderItem.status === 'Delivered' ||
      orderItem.status === 'Cancelled' ||
      orderItem.status === 'ReturnRequested'
    )
      return;
    orderItem.status = req.body.orderStatus;
  });

  if (req.body.orderStatus === 'Delivered') {
    order.deliveredAt = Date.now();
  }

  const savedDoc = await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    updatedDocument: savedDoc,
  });
});

// Cancel order
exports.cancelOrder = catchAsyncErrors(async (req, res, next) => {
  const { productId, reason } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) return next(new ErrorHandler('Order not found', 404));

  if (order.user.toString() !== req.user.id && req.user.role !== 'admin')
    return next(new ErrorHandler('You can cancel your order only', 405));

  for (let i = 0; i < order.orderItems.length; i++) {
    const product = order.orderItems[i];
    if (product.productId.toString() === productId) {
      // Product found
      if (product.status === 'Cancelled')
        return next(new ErrorHandler('Product already cancelled', 400));

      if (product.status === 'Delivered')
        return next(new ErrorHandler('Product already delivered', 400));

      if (product.status === 'ReturnRequested')
        return next(
          new ErrorHandler('Product already requested for return', 400),
        );
    }
  }
  for (let i = 0; i < order.orderItems.length; i++) {
    const product = order.orderItems[i];

    if (product.productId.toString() === productId) {
      console.log('Product found');
      product.status = 'Cancelled';
      product.reason = reason;
      product.timeOfReturn = Date.now();
      // Update order totals
      order.itemsPrice -= product.price;
      order.totalPrice -= product.price;
    }
  }
  const allProductsCancelled = order.orderItems.every((orderItem) => {
    return orderItem.cancelled === true;
  });

  if (allProductsCancelled) {
    order.orderStatus = 'Cancelled';
  }

  // Update stock
  for (let i = 0; i < order.orderItems.length; i++) {
    const orderItem = order.orderItems[i];
    if (orderItem.cancelled) {
      await updateStock(
        orderItem.productId.toString(),
        orderItem.quantity * -1,
      );
    }
  }

  const savedDoc = await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    updatedDocument: savedDoc,
    message: 'Order cancelled',
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

// Delete order
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }

  await order.remove();
  res.status(200).json({
    success: true,
    message: 'Order deleted',
  });
});

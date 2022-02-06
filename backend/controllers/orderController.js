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
      orderItem.status === 'Return requested'
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

      if (product.status === 'Return requested')
        return next(
          new ErrorHandler('Product already requested for return', 400),
        );

      // All good, update product status
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

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    message: 'Order cancelled. Amount refunded',
  });
});

// Return order
exports.returnOrder = catchAsyncErrors(async (req, res, next) => {
  const { productId, reason } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) return next(new ErrorHandler('Order not found', 404));

  if (order.user.toString() !== req.user.id && req.user.role !== 'admin')
    return next(new ErrorHandler('You can return your order only', 405));

  for (let i = 0; i < order.orderItems.length; i++) {
    const product = order.orderItems[i];
    if (product.productId.toString() === productId) {
      // Product found
      if (product.status === 'Processing' || product.status === 'Shipped')
        return next(
          new ErrorHandler(
            'Product not delivered yet. You can cancel the order instead',
            400,
          ),
        );

      if (product.status === 'Cancelled')
        return next(new ErrorHandler('Product already cancelled', 400));

      if (product.status === 'Returned')
        return next(new ErrorHandler('Product already returned', 400));

      // All good, update status
      // Check if product has crossed the return window
      const returnWindow = order.deliveredAt + 1000 * 60 * 60 * 24 * 7; // 7 days
      if (Date.now() > returnWindow) {
        return next(
          new ErrorHandler(
            'Product cannot be returned. It has crossed the return window',
            400,
          ),
        );
      }

      product.status = 'Return requested';
      product.reason = reason;
      product.timeOfReturn = Date.now();
    }
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    message: 'Return requested',
  });
});

// Cancel return request
exports.cancelReturn = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) return next(new ErrorHandler('Order not found', 404));

  if (order.user.toString() !== req.user.id && req.user.role !== 'admin')
    return next(new ErrorHandler('You can manage your order only', 405));

  for (let i = 0; i < order.orderItems.length; i++) {
    const product = order.orderItems[i];

    if (product.productId.toString() === productId) {
      // Product found
      if (product.status !== 'Return requested') {
        return next(
          new ErrorHandler(
            'Product not requested for return. You can cancel the order instead',
            400,
          ),
        );
      }
      product.status = 'Delivered';
      product.reason = '';
    }
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    message: 'Return cancelled',
    success: true,
  });
});

// Get all return requests
exports.getReturnRequests = catchAsyncErrors(async (req, res, next) => {
  const retReqs = Order.aggregate(
    [
      {
        $match: {
          orderItems: {
            $elemMatch: {
              status: 'Return requested',
            },
          },
        },
      },
      {
        $unwind: {
          path: '$orderItems',
        },
      },
      {
        $match: {
          'orderItems.status': 'Return requested',
        },
      },
      {
        $sort: {
          'orderItems.status': 1,
        },
      },
    ],
    function (err, result) {
      if (err) {
        return next(new ErrorHandler('Error fetching return requests', 400));
      }
      res.status(200).json({
        success: true,
        returnRequests: result,
      });
    },
  );
});

// Manager approve return request
exports.manageReturnRequest = catchAsyncErrors(async (req, res, next) => {
  const { orderId, productId, action } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }

  const product = order.orderItems.find(
    (orderItem) => orderItem.productId.toString() === productId,
  );

  console.log('product', product);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  if (product.status !== 'Return requested') {
    return next(new ErrorHandler('Product not requested for return', 400));
  }

  if (action === 'accepted') {
    product.status = 'Returned';
    console.log('product.status', product.status);
  }

  if (action === 'rejected') {
    product.status = 'Return rejected';
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    message: 'Return request ' + action,
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

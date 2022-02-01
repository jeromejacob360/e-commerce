const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      name: { type: String, required: true },
      area: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String, required: true },
      pinCode: { type: String, required: true },
      state: { type: String, required: true },
      mobile: { type: String, required: true },
    },
    orderItems: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        status: { type: String, default: 'Processing' },
        reason: { type: String, default: '' },
        timeOfReturn: { type: Date, default: null },
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    paymentInfo: {
      id: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
    },
    paidAt: {
      type: Date,
      required: true,
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    orderStatus: {
      type: String,
      required: true,
      default: 'Processing',
    },
    deliveredAt: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timeStamps: true },
);

orderSchema.post('save', function updateOrder() {
  if (this.orderStatus === 'Processing') {
    setTimeout(() => {
      this.orderStatus = 'Shipped';
    }, 1000 * 60 * 60); // 1 hour
  } else if (this.orderStatus === 'Shipped') {
    setTimeout(() => {
      this.orderStatus = 'Delivered';
      this.deliveredAt = Date.now();
    }, 1000 * 60 * 60); // 1 hour
  }

  this.orderItems.forEach((orderItem) => {
    if (orderItem.status === 'Return requested')
      setTimeout(() => {
        orderItem.status = 'Return accepted';
      }, 1000 * 60 * 60); // 1 hour
  });
  this.save();
});

module.exports = mongoose.model('Order', orderSchema);

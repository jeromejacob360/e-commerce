const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    dafault: 0,
  },
  images: [{}],
  category: {
    type: String,
  },
  stock: {
    type: Number,
    required: [true, 'Product stock is required'],
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      name: {
        type: String,
        required: [true, 'Review name is required'],
      },
      rating: {
        type: Number,
        required: [true, 'Review rating is required'],
        min: [0, 'Review rating must be greater than 0'],
        max: [5, 'Review rating must be less than 5'],
      },
      reviewMessage: {
        type: String,
        required: [true, 'Review comment is required'],
      },
    },
  ],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Product creator is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', productSchema);

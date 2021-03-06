const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, 'Invalid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [3, 'Password must be at least 4 characters long'],
      maxlength: 1024,
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    role: {
      type: String,
      default: 'user',
    },

    shippingInfo: {
      mobile: {
        type: String,
        minlength: [10, 'Mobile number must be at least 10 characters'],
        maxlength: [10, 'Mobile number must be at most 10 characters'],
      },
      name: {
        type: String,
      },
      area: {
        type: String,
      },
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      district: {
        type: String,
      },
      pinCode: {
        type: String,
        minlength: [6, 'PIN must be at least 6 characters'],
        maxlength: [6, 'PIN must be at most 6 characters'],
      },
      state: {
        type: String,
      },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },

  { timestamps: true },
);

// Hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Match user entered password to hashed password in database
userSchema.methods.correctPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password reset token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

// JWT
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_HOURS,
  });
};

module.exports = mongoose.model('User', userSchema);

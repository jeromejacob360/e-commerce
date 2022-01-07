const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('./catchAsyncErrors');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    console.log('No token found');
    return next(new ErrorHandler('Plese login to continue!', 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded.id) {
    console.log('Invalid token');
    return next(new ErrorHandler('Invalid token!', 401));
  }
  req.user = await User.findById(decoded.id);
  next();
});

exports.authorizeRoles =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user.role} is not authorized to perform this action`,
          403,
        ),
      );
    }
    next();
  };

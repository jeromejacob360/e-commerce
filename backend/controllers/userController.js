const User = require('../models/userModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const cloudinary = require('cloudinary');

// Register a new user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  let user;
  const { name, email, password, avatar } = req.body;
  if (!name || !email || !password) {
    return next(new ErrorHandler('Name, email and password are required', 400));
  }

  if (avatar) {
    const myCloudinary = await cloudinary.v2.uploader.upload(avatar, {
      folder: 'avatars',
      width: 200,
      crop: 'fill',
    });

    user = await User.create({
      ...req.body,
      avatar: {
        public_id: myCloudinary.public_id,
        url: myCloudinary.secure_url,
      },
    });
  } else {
    user = await User.create(req.body);
  }
  sendToken(user, 201, res, 'User registered successfully');
});

// Login a user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new ErrorHandler('Please provide email and password', 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password))) {
    return next(new ErrorHandler('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  sendToken(user, 200, res, 'Login successful');
});

// Logout a user
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
});

// Forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  // 1) Get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(
      new ErrorHandler('There is no user with that email address', 404),
    );

  // 2) Generate the random reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/password/reset/${resetToken}`;

  const message = `Your password reset token is: \n\n ${resetURL}.\n\n If you did not request a password reset, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 minutes)',
      message,
    });

    res.status(200).json({
      success: true,
      message: `Token sent to ${user.email}`,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new ErrorHandler(
        err.message || 'Some error occurred while sending the email',
        500,
      ),
    );
  }
});

// Get user details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return;

  res.status(200).json({
    success: true,
    user,
  });
});

// Get user's reviews
exports.getUserReviews = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find(
    { 'reviews.userId': { $eq: req.user.id } },
    'description , name , reviews , images',
  );

  let reviews = [];

  products.forEach((product) =>
    product.reviews.forEach((review) => {
      if (review.userId.toString() === req.user.id) {
        const { reviewMessage, rating, _id, createdAt } = review;
        reviews.push({
          reviewMessage,
          rating,
          reviewId: _id,
          createdAt,
          productId: product._id.toString(),
          productName: product.name,
          productDescription: product.description,
          image: product?.images[0]?.url,
        });
      }
    }),
  );
  res.status(200).json({
    success: true,
    reviews: reviews,
  });
});

// Update user details
exports.updateUserDetails = catchAsyncErrors(async (req, res, next) => {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUser, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    user,
  });
});

// Get all users (Admin only)
exports.getAlluserDetails = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

// Get single user detail (Admin only)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorHandler('User not found', 400));

  res.status(200).json({
    success: true,
    user,
  });
});

// Update user role (Admin only)
exports.updateUserDetailsAdmin = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    },
  );

  if (!user) return next(new ErrorHandler('User not found', 400));
  res.status(200).json({
    success: true,
    user,
  });
});

// Delete user (Admin only)
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorHandler('User not found', 400));
  await user.remove();
  res.status(200).json({
    success: true,
    user,
  });
});

// Save shipping address
exports.saveAddress = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(new ErrorHandler('User not found', 400));

  user.shippingInfo = req.body;
  await user.save();

  res.status(200).json({
    success: true,
    user,
  });
});

const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');

// Register a new user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.create(req.body);
  sendToken(user, 201, res, 'User registered successfully');
});

// Login a user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password)
    return next(new ErrorHandler('Please provide email and password', 400));

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password)))
    return next(new ErrorHandler('Incorrect email or password', 401));

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
  )}/api/v1/password/reset/${resetToken}`;

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

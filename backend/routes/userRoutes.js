const router = require('express').Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
  updateUserDetails,
  getAlluserDetails,
  getSingleUser,
  updateUserDetailsAdmin,
  deleteUser,
  saveAddress,
  getUserReviews,
  forgotPassword,
  resetPassword,
  changePassword,
} = require('../controllers/userController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/change').put(isAuthenticatedUser, changePassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/logout').get(logoutUser);
router.route('/me').get(isAuthenticatedUser, getUserDetails);
router.route('/me/update').put(isAuthenticatedUser, updateUserDetails);
router.route('/shipping').post(isAuthenticatedUser, saveAddress);
router.route('/me/reviews').get(isAuthenticatedUser, getUserReviews);

// Admin routes
router
  .route('/admin/users')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getAlluserDetails);
router
  .route('/admin/user/:id')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getSingleUser)
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateUserDetailsAdmin)
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser);

module.exports = router;

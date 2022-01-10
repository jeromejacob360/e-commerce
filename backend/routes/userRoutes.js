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
} = require('../controllers/userController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/me').get(isAuthenticatedUser, getUserDetails);
router.route('/me/update').get(isAuthenticatedUser, updateUserDetails);
router.route('/shipping').post(isAuthenticatedUser, saveAddress);

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

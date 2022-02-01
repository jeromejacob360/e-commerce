const {
  createOrder,
  getUserOrders,
  getOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
  cancelOrder,
} = require('../controllers/orderController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const router = require('express').Router();

router.route('/orders/new').post(isAuthenticatedUser, createOrder);
router.route('/order/:id').get(isAuthenticatedUser, getOrder);
router.route('/order/cancel/:id').put(isAuthenticatedUser, cancelOrder);
router.route('/orders/me').get(isAuthenticatedUser, getUserOrders);
router
  .route('/admin/orders')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getAllOrders);
router
  .route('/admin/order/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrder);

module.exports = router;

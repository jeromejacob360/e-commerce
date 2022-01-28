const express = require('express');
const router = express.Router();

const {
  addProductToCart,
  removeFromCart,
  getCart,
} = require('../controllers/cartController');
const { isAuthenticatedUser } = require('../middlewares/auth');

// Routes

router.route('/cart/add').post(isAuthenticatedUser, addProductToCart);
router.route('/cart/remove').post(isAuthenticatedUser, removeFromCart);
router.route('/cart').get(isAuthenticatedUser, getCart);

module.exports = router;

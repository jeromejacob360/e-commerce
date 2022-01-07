const express = require('express');
const router = express.Router();

const { addProductToCart, getCart } = require('../controllers/cartController');
const { isAuthenticatedUser } = require('../middlewares/auth');

// Routes

router.route('/cart/add').post(isAuthenticatedUser, addProductToCart); //TODO add userless cart add
router.route('/cart').get(isAuthenticatedUser, getCart);

module.exports = router;

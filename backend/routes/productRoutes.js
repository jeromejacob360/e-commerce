const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  createProduct,
} = require('../controllers/productController');

// Routes
router.route('/products').get(getAllProducts);
router.route('/product/new').post(createProduct);

module.exports = router;

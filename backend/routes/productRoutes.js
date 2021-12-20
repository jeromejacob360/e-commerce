const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
} = require('../controllers/productController');

// Routes
router.route('/products').get(getAllProducts);
router.route('/product/new').post(createProduct);
router.route('/product/:id').get(getProduct);
router.route('/product/:id').put(updateProduct).delete(deleteProduct);

module.exports = router;

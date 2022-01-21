const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  addProductReview,
  getProductReviews,
  deleteProductReview,
  getAdminProducts,
} = require('../controllers/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

// Routes

// User routes
router.route('/products').get(getAllProducts);
router.route('/product/:id').get(getProduct);
router
  .route('/reviews')
  .get(getProductReviews)
  .delete(isAuthenticatedUser, deleteProductReview);
router.route('/review').put(isAuthenticatedUser, addProductReview);

// Admin routes
router
  .route('/admin/product/new')
  .post(isAuthenticatedUser, authorizeRoles('admin'), createProduct);

router
  .route('/admin/products')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getAdminProducts);

router
  .route('/admin/product/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);

module.exports = router;

import axios from 'axios';

// Get all products
export function fetchProducts(
  keyword = '',
  page = 1,
  price = [0, 10000],
  category,
  rating,
  sort = '-popularity',
  limit = 4,
) {
  return async function (dispatch) {
    try {
      dispatch({ type: 'ALL_PRODUCT_REQUEST' });

      let body = {};

      let link = `/api/products?keyword=${keyword}&page=${page}&price[gte]=${price[0]}&price[lte]=${price[1]}&sort=${sort}&limit=${limit}`;

      if (category) {
        body.categories = category;
      }

      if (category && rating !== null) {
        link += `&rating[gte]=${rating}`;
      }

      const { data } = await axios.post(link, body);

      dispatch({
        type: 'ALL_PRODUCT_SUCCESS',
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: 'ALL_PRODUCT_FAILURE',
        payload: error.response.data.message,
      });
    }
  };
}

export function fetchProductDetails(id) {
  return async function (dispatch) {
    try {
      dispatch({ type: 'PRODUCT_DETAILS_REQUEST' });

      const { data } = await axios.get('/api/product/' + id);

      dispatch({
        type: 'PRODUCT_DETAILS_SUCCESS',
        payload: data.product,
      });
    } catch (error) {
      dispatch({
        type: 'PRODUCT_DETAILS_FAILURE',
        payload: error.response.data.message,
      });
    }
  };
}

export function fetchProductReviews(id) {
  return async function (dispatch) {
    try {
      dispatch({ type: 'PRODUCT_REVIEWS_REQUEST' });

      const { data } = await axios.get('/api/reviews/?id=' + id);

      dispatch({
        type: 'PRODUCT_REVIEWS_SUCCESS',
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: 'PRODUCT_REVIEWS_FAILURE',
        payload: error.response.data.message,
      });
    }
  };
}

export function deleteReview(pId, rId) {
  return async function (dispatch) {
    try {
      dispatch({ type: 'DELETE_REVIEW_REQUEST' });

      const { data } = await axios.delete(
        `/api/reviews/?productId=${pId}&reviewId=${rId}`,
      );

      dispatch({
        type: 'DELETE_REVIEW_SUCCESS',
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: 'DELETE_REVIEW_FAILURE',
        payload: error.response.data.message,
      });
    }
  };
}

//Get all products (Admin)
export function fetchAdminProducts() {
  return async function (dispatch) {
    try {
      dispatch({ type: 'ADMIN_PRODUCTS_REQUEST' });
      const { data } = await axios.get('/api/admin/products');
      dispatch({
        type: 'ADMIN_PRODUCTS_SUCCESS',
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: 'ADMIN_PRODUCTS_FAILURE',
        payload: error.response.data.message,
      });
    }
  };
}

// Create a product (admin only)
export function createProduct(product) {
  return async function (dispatch) {
    try {
      dispatch({ type: 'NEW_PRODUCT_REQUEST' });
      const { data } = await axios.post('/api/admin/product/new', product);

      dispatch({
        type: 'NEW_PRODUCT_SUCCESS',
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: 'NEW_PRODUCT_FAILURE',
        payload: error.response.data.message,
      });
    }
    dispatch({ type: 'CLEAR_PRODUCT' });
  };
}

// Update a product (admin only)
export function updateProduct(product) {
  return async function (dispatch) {
    try {
      dispatch({ type: 'UPDATE_PRODUCT_REQUEST' });
      const { data } = await axios.put(
        '/api/admin/product/' + product._id,
        product,
      );

      dispatch({
        type: 'UPDATE_PRODUCT_SUCCESS',
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: 'UPDATE_PRODUCT_FAILURE',
        payload: error.response.data.message,
      });
    }
    dispatch({ type: 'CLEAR_PRODUCT' });
  };
}

// Delete a product (admin only)
export function deleteProduct(productId) {
  return async function (dispatch) {
    try {
      dispatch({ type: 'DELETE_PRODUCT_REQUEST' });
      const { data } = await axios.delete('/api/admin/product/' + productId);

      dispatch({
        type: 'DELETE_PRODUCT_SUCCESS',
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: 'DELETE_PRODUCT_FAILURE',
        payload: error.response.data.message,
      });
    }
    dispatch({ type: 'CLEAR_PRODUCT' });
  };
}

// Add a review
export const addReview =
  (productId, rating, review, avatar) => async (dispatch) => {
    dispatch({
      type: 'NEW_REVIEW_REQUEST',
    });

    try {
      const { data } = await axios.put('/api/review', {
        productId,
        rating,
        reviewMessage: review,
        avatar,
      });

      dispatch({
        type: 'NEW_REVIEW_SUCCESS',
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: 'NEW_REVIEW_FAILURE',
        payload: error.response.data.message,
      });
    }
  };

// Clear errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: 'CLEAR_ERRORS' });
};

export const clearProductErrors = () => (dispatch) => {
  dispatch({ type: 'CLEAR_PRODUCT_ERRORS' });
};

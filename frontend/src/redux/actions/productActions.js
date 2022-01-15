import axios from 'axios';

// Get all products
export function fetchProducts(
  keyword = '',
  page = 1,
  price = [0, 25000],
  category,
  rating,
) {
  return async function (dispatch) {
    try {
      dispatch({ type: 'ALL_PRODUCT_REQUEST' });

      let link = `/api/products?keyword=${keyword}&page=${page}&price[gte]=${price[0]}&price[lte]=${price[1]}`;

      if (category && category !== 'All') {
        link += `&category=${category.toLowerCase()}`;
      }

      if (category && rating !== null) {
        link += `&rating[gte]=${rating}`;
      }

      const { data } = await axios.get(link);

      dispatch({
        type: 'ALL_PRODUCT_SUCCESS',
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: 'ALL_PRODUCT_FAILURE',
        payload: error,
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
        payload: error,
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
      console.log(`error`, error);
      dispatch({
        type: 'ADMIN_PRODUCTS_FAILURE',
        payload: error,
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
        payload: error,
      });
    }
    dispatch({ type: 'CLEAR_PRODUCT' });
  };
}

// Delete a product (admin only)
export function deleteProduct(productId) {
  return async function (dispatch) {
    console.log(`productId`, productId);
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
        payload: error,
      });
    }
    dispatch({ type: 'CLEAR_PRODUCT' });
  };
}

// Add a review
export const addReview = (productId, rating, review) => async (dispatch) => {
  dispatch({
    type: 'NEW_REVIEW_REQUEST',
  });

  try {
    const { data } = await axios.put('/api/review', {
      productId,
      rating,
      reviewMessage: review,
    });

    dispatch({
      type: 'NEW_REVIEW_SUCCESS',
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: 'NEW_REVIEW_FAILURE',
      payload: error,
    });
  }
};

// Clear errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: 'CLEAR_ERRORS' });
};

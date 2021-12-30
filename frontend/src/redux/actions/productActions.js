import axios from 'axios';

export function fetchProducts() {
  return async function (dispatch) {
    try {
      dispatch({ type: 'ALL_PRODUCT_REQUEST' });

      const { data } = await axios.get('/api/v1/products');

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

// Clear errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: 'CLEAR_ERRORS' });
};

export function fetchProductDetails(id) {
  return async function (dispatch) {
    try {
      dispatch({ type: 'PRODUCT_DETAILS_REQUEST' });

      const { data } = await axios.get('/api/v1/product/' + id);

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

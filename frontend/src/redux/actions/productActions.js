import axios from 'axios';

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

// Clear errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: 'CLEAR_ERRORS' });
};

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

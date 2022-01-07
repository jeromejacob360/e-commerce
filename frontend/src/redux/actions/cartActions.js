import axios from 'axios';

export function addToCart(product, quantity) {
  return async function (dispatch) {
    try {
      dispatch({ type: 'ADD_TO_CART_REQUEST', payload: { product, quantity } });

      const { data } = await axios.post('/api/v1/cart/add', {
        product,
        quantity,
      });

      dispatch({
        type: 'ADD_TO_CART_SUCCESS',
        payload: data.cart,
      });
    } catch (error) {
      console.log(`error.response`, error.response);
      dispatch({
        type: 'ADD_TO_CART_FAILURE',
        payload: error.response.data.message,
      });
    }
  };
}

export function loadCart() {
  return async function (dispatch) {
    const { data } = await axios.get('/api/v1/cart');
    console.log(`data.cart`, data.cart);
    dispatch({
      type: 'LOAD_CART_SUCCESS',
      payload: data.cart,
    });
  };
}

export function clearCartErrors() {
  return async function (dispatch) {
    dispatch({ type: 'CLEAR_CART_ERRORS' });
  };
}

import axios from 'axios';

export function addToCart(productId, quantity) {
  return async function (dispatch) {
    try {
      dispatch({ type: 'ADD_TO_CART_REQUEST' });

      const { data } = await axios.post('/api/cart/add', {
        productId,
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

export function removeFromCart(productId) {
  return async function (dispatch) {
    try {
      dispatch({ type: 'REMOVE_FROM_CART_REQUEST' });

      const { data } = await axios.post('/api/cart/remove', {
        productId,
      });

      dispatch({
        type: 'REMOVE_FROM_CART_SUCCESS',
        payload: data.cart,
      });
    } catch (error) {
      console.log(`error.response`, error.response);
      dispatch({
        type: 'REMOVE_FROM_CART_FAILURE',
        payload: error.response.data.message,
      });
    }
  };
}

export function loadCart() {
  return async function (dispatch) {
    const { data } = await axios.get('/api/cart');
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

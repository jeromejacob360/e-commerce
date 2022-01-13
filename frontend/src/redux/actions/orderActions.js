import axios from 'axios';

export const createOrder = (order) => async (dispatch) => {
  try {
    dispatch({
      type: 'CREATE_ORDER_REQUEST',
    });

    const { data } = await axios.post('/api/orders/new', order);

    dispatch({
      type: 'CREATE_ORDER_SUCCESS',
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: 'CREATE_ORDER_FAILURE',
      payload: error.response.data.message,
    });
  }
};

export const getMyOrders = () => async (dispatch) => {
  try {
    dispatch({
      type: 'MY_ORDERS_REQUEST',
    });

    const { data } = await axios.get('/api/orders/me');

    dispatch({
      type: 'MY_ORDERS_SUCCESS',
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: 'MY_ORDERS_FAILURE',
      payload: error.response.data.message,
    });
  }
};

export const getOrderDetails = (id) => async (dispatch) => {
  try {
    dispatch({
      type: 'ORDER_DETAILS_REQUEST',
    });

    const { data } = await axios.get(`/api/order/${id}`);

    dispatch({
      type: 'ORDER_DETAILS_SUCCESS',
      payload: data,
    });
  } catch (error) {
    console.log(`error.response`, error.response);
    dispatch({
      type: 'ORDER_DETAILS_FAILURE',
      payload: error.response.data.message,
    });
  }
};

export const clearErrors = () => (dispatch) => {
  dispatch({
    type: 'CLEAR_ERRORS',
  });
};

import axios from 'axios';

// Create an order
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

// Update an order
export const updateOrder = (id, order) => async (dispatch) => {
  try {
    dispatch({
      type: 'UPDATE_ORDER_REQUEST',
    });

    console.log(`id, order`, id, order);

    const { data } = await axios.put('/api/admin/order/' + id, order);

    dispatch({
      type: 'UPDATE_ORDER_SUCCESS',
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: 'UPDATE_ORDER_FAILURE',
      payload: error.response.data.message,
    });
  }
};

// Delete an order
export const deleteOrder = (id) => async (dispatch) => {
  try {
    dispatch({
      type: 'DELETE_ORDER_REQUEST',
    });

    const { data } = await axios.delete('/api/admin/order/' + id);

    dispatch({
      type: 'DELETE_ORDER_SUCCESS',
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: 'DELETE_ORDER_FAILURE',
      payload: error.response.data.message,
    });
  }
};

// Get my orders
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

// Get all orders
export const getAllOrders = () => async (dispatch) => {
  try {
    dispatch({
      type: 'GET_ALL_ORDERS_REQUEST',
    });

    const { data } = await axios.get('/api/admin/orders');

    dispatch({
      type: 'GET_ALL_ORDERS_SUCCESS',
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: 'GET_ALL_ORDERS_FAILURE',
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

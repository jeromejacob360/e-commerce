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

// Cancel an order
export const cancelOrder = (productId, orderId, reason) => async (dispatch) => {
  try {
    dispatch({
      type: 'CANCEL_ORDER_REQUEST',
    });

    const { data } = await axios.put('/api/order/cancel/' + orderId, {
      productId,
      reason,
    });

    dispatch({
      type: 'CANCEL_ORDER_SUCCESS',
      payload: data,
    });
    dispatch({
      type: 'CLEAR_SUCCESS',
    });
  } catch (error) {
    dispatch({
      type: 'CANCEL_ORDER_FAILURE',
      payload: error.response.data.message,
    });

    dispatch({
      type: 'CLEAR_ERRORS',
    });
  }
};

// Return an order
export const returnOrder = (productId, orderId, reason) => async (dispatch) => {
  try {
    dispatch({
      type: 'RETURN_ORDER_REQUEST',
    });

    const { data } = await axios.put('/api/order/return/' + orderId, {
      productId,
      reason,
    });

    dispatch({
      type: 'RETURN_ORDER_SUCCESS',
      payload: data,
    });
    dispatch({
      type: 'CLEAR_SUCCESS',
    });
  } catch (error) {
    dispatch({
      type: 'RETURN_ORDER_FAILURE',
      payload: error.response.data.message,
    });

    dispatch({
      type: 'CLEAR_ERRORS',
    });
  }
};

// Cancel a return
export const cancelReturn = (productId, orderId) => async (dispatch) => {
  try {
    dispatch({
      type: 'CANCEL_RETURN_REQUEST',
    });

    const { data } = await axios.post('/api/order/return/' + orderId, {
      productId,
    });

    dispatch({
      type: 'CANCEL_RETURN_SUCCESS',
      payload: data,
    });
    dispatch({
      type: 'CLEAR_SUCCESS',
    });
  } catch (error) {
    dispatch({
      type: 'CANCEL_RETURN_FAILURE',
      payload: error.response.data.message,
    });

    dispatch({
      type: 'CLEAR_ERRORS',
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

// Get all return requests
export const getAllReturnRequests = () => async (dispatch) => {
  try {
    dispatch({
      type: 'GET_RETURN_REQUESTS_REQUEST',
    });

    const { data } = await axios.get('/api/admin/returns');

    dispatch({
      type: 'GET_RETURN_REQUESTS_SUCCESS',
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: 'GET_RETURN_REQUESTS_FAILURE',
      payload: error.response.data.message,
    });
    dispatch({
      type: 'CLEAR_ERRORS',
    });
  }
};

// Manage return requests
export const manageReturnRequest =
  (orderId, productId, action) => async (dispatch) => {
    console.log('productId, orderId, action', productId, orderId, action);
    try {
      dispatch({
        type: 'MANAGE_RETURN_REQUEST',
      });

      const { data } = await axios.put('/api/admin/returns', {
        orderId,
        productId,
        action,
      });

      dispatch({
        type: 'MANAGE_RETURN_SUCCESS',
        payload: data,
      });

      dispatch({
        type: 'CLEAR_SUCCESS',
      });
    } catch (error) {
      console.log('error', error);
      dispatch({
        type: 'MANAGE_RETURN_FAILURE',
        payload: error.response.data.message,
      });

      dispatch({
        type: 'CLEAR_ERRORS',
      });
    }
  };

// Get order by id
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

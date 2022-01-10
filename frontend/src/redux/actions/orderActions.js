import axios from 'axios';

export const createOrder = (order) => async (dispatch) => {
  try {
    dispatch({
      type: 'CREATE_ORDER_REQUEST',
    });

    const { data } = await axios.post('/api/v1/orders/new', order);

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

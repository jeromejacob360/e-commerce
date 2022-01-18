import axios from 'axios';

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: 'LOGIN_REQUEST' });

    const { data } = await axios.post(`/api/login`, { email, password });

    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: 'LOGIN_FAILURE',
      payload: error.response.data.message,
    });
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    dispatch({ type: 'LOGOUT_REQUEST' });
    dispatch({ type: 'CLEAR_CART' });

    await axios.get(`/api/logout`);

    dispatch({
      type: 'LOGOUT_SUCCESS',
    });
  } catch (error) {
    dispatch({
      type: 'LOGOUT_FAILURE',
      payload: error.response.data.message,
    });
  }
};

export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: 'LOAD_USER_REQUEST' });

    const { data } = await axios.get(`/api/me`);

    dispatch({
      type: 'LOAD_USER_SUCCESS',
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: 'LOAD_USER_FAILURE',
      payload: error.response.data.message,
    });
  }
};

export const register = (user) => async (dispatch) => {
  try {
    dispatch({ type: 'REGISTER_REQUEST' });

    const { data } = await axios.post(`/api/register`, user);

    dispatch({
      type: 'REGISTER_SUCCESS',
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: 'REGISTER_FAILURE',
      payload: error.response.data.message,
    });
  }
};

export const saveShippingInfo = (address) => async (dispatch) => {
  try {
    dispatch({ type: 'SAVE_SHIPPING_INFO_REQUEST' });

    const { data } = await axios.post(`/api/shipping`, address);

    dispatch({
      type: 'SAVE_SHIPPING_INFO_SUCCESS',
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: 'SAVE_SHIPPING_INFO_FAILURE',
      payload: error.response.data.message,
    });
  }
};

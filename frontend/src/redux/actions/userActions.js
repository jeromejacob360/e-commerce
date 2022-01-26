import axios from 'axios';

// Login a user
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

// Logout
export const logoutUser = () => async (dispatch) => {
  try {
    dispatch({ type: 'LOGOUT_REQUEST' });

    await axios.get(`/api/logout`);

    dispatch({
      type: 'LOGOUT_SUCCESS',
    });
    dispatch({
      type: 'CLEAR_STATE',
    });
  } catch (error) {
    dispatch({
      type: 'LOGOUT_FAILURE',
      payload: error.response.data.message,
    });
  }
};

// send forgot password email
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: 'FORGOT_PASSWORD_REQUEST' });

    const { data } = await axios.post(`/api/password/forgot`, { email: email });

    dispatch({
      type: 'FORGOT_PASSWORD_SUCCESS',
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: 'FORGOT_PASSWORD_FAILURE',
      payload: error.response.data.message,
    });
  }
};
//Reset password
export const resetPassword =
  (password, confirmPassword, token) => async (dispatch) => {
    try {
      dispatch({ type: 'RESET_PASSWORD_REQUEST' });

      const { data } = await axios.put(`/api/password/reset/${token}`, {
        password,
        confirmPassword,
      });
      console.log('data', data);

      dispatch({
        type: 'RESET_PASSWORD_SUCCESS',
        payload: data.message,
      });
    } catch (error) {
      dispatch({
        type: 'RESET_PASSWORD_FAILURE',
        payload: error.response.data.message,
      });
    }
  };

// Load user to state
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

// New user register
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

// Save shipping info
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

// Get all users
export const fetchAllUsers = () => async (dispatch) => {
  try {
    dispatch({ type: 'ALL_USERS_REQUEST' });

    const { data } = await axios.get(`/api/admin/users`);

    dispatch({
      type: 'ALL_USERS_SUCCESS',
      payload: data.users,
    });
  } catch (error) {
    dispatch({
      type: 'ALL_USERS_FAILURE',
      payload: error.response.data.message,
    });
  }
};

// Get user's reviews
export const getUserReviews = () => async (dispatch) => {
  try {
    dispatch({ type: 'ALL_REVIEWS_REQUEST' });

    const { data } = await axios.get(`/api/me/reviews`);

    dispatch({
      type: 'ALL_REVIEWS_SUCCESS',
      payload: data.reviews,
    });
  } catch (error) {
    dispatch({
      type: 'ALL_REVIEWS_FAILURE',
      payload: error.response.data.message,
    });
  }
};

// Delete a user
export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'DELETE_USER_REQUEST' });

    const { data } = await axios.delete(`/api/admin/user/` + id);

    dispatch({
      type: 'DELETE_USER_SUCCESS',
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: 'DELETE_USER_FAILURE',
      payload: error.response.data.message,
    });
  }
};

// Change user role - Admin
export const updateUser = (id, role) => async (dispatch) => {
  try {
    dispatch({ type: 'UPDATE_USER_REQUEST' });

    const { data } = await axios.put(`/api/admin/user/` + id, { role });

    dispatch({
      type: 'UPDATE_USER_SUCCESS',
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: 'UPDATE_USER_FAILURE',
      payload: error.response.data.message,
    });
  }
};

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: 'CLEAR_ERRORS' });
};

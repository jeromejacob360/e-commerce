export const userReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case 'LOAD_USER_REQUEST':
    case 'REGISTER_REQUEST':
    case 'LOGIN_REQUEST':
      return {
        loading: true,
        isAuthenticated: false,
      };

    case 'LOAD_USER_SUCCESS':
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
      return {
        loading: false,
        isAuthenticated: true,
        user: action.payload,
      };

    case 'REGISTER_FAILURE':
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        error: action.payload,
      };

    case 'LOAD_USER_FAILURE':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
      };

    case 'LOGOUT_REQUEST':
      return {
        loading: true,
        isAuthenticated: true,
      };

    case 'LOGOUT_SUCCESS':
      return {
        loading: false,
        isAuthenticated: false,
        user: {},
      };

    case 'LOGOUT_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

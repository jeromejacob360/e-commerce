export const userReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case 'LOAD_USER_REQUEST':
    case 'REGISTER_REQUEST':
    case 'LOGIN_REQUEST':
      return {
        loading: true,
        isAuthenticated: null,
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

    case 'SAVE_SHIPPING_INFO_REQUEST':
      return {
        ...state,
        shippingInfoloading: true,
      };

    case 'SAVE_SHIPPING_INFO_SUCCESS':
      return {
        ...state,
        shippingInfoloading: false,
        user: action.payload,
      };

    case 'SAVE_SHIPPING_INFO_FAILURE':
      return {
        ...state,
        shippingInfoloading: false,
        error: action.payload,
      };

    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null,
      };

    case 'CLEAR_STATE':
      return { user: {} };

    default:
      return state;
  }
};

export const allUsersReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    case 'ALL_USERS_REQUEST':
      return {
        loading: true,
      };

    case 'ALL_USERS_SUCCESS':
      return {
        loading: false,
        users: action.payload,
      };

    case 'ALL_USERS_FAILURE':
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
    case 'CLEAR_STATE':
      return { users: [] };
    default:
      return state;
  }
};

export const profileReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case 'UPDATE_USER_REQUEST':
    case 'DELETE_USER_REQUEST':
      return {
        loading: true,
      };

    case 'UPDATE_USER_SUCCESS':
    case 'DELETE_USER_SUCCESS':
      return {
        loading: false,
        ...action.payload,
      };

    case 'UPDATE_USER_FAILURE':
    case 'DELETE_USER_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case 'RESET_PROFILE_UPDATE':
    case 'RESET_PROFILE_DELETE':
      return {
        loading: false,
      };

    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null,
      };
    case 'CLEAR_STATE':
      return { user: {} };

    default:
      return state;
  }
};

export const usersReviewsReducer = (state = { reviews: [] }, action) => {
  switch (action.type) {
    case 'ALL_REVIEWS_REQUEST':
      return {
        loading: true,
      };

    case 'ALL_REVIEWS_SUCCESS':
      return {
        loading: false,
        reviews: action.payload,
      };

    case 'ALL_REVIEWS_FAILURE':
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
    case 'CLEAR_STATE':
      return { reviews: [] };

    default:
      return state;
  }
};

// Create an order
export const newOrderReducer = (state = {}, action) => {
  switch (action.type) {
    case 'CREATE_ORDER_REQUEST':
      return {
        ...state,
        loading: true,
      };
    case 'CREATE_ORDER_SUCCESS':
      return {
        ...state,
        loading: false,
        ...action.payload,
      };
    case 'CREATE_ORDER_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case 'CLEAR_SUCCESS':
      return {
        ...state,
        success: null,
      };

    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null,
      };
    case 'CLEAR_STATE':
      return {};

    default:
      return state;
  }
};

// Cancel/return order
export const cancelOrderReducer = (state = {}, action) => {
  switch (action.type) {
    case 'CANCEL_ORDER_REQUEST':
    case 'RETURN_ORDER_REQUEST':
    case 'CANCEL_RETURN_REQUEST':
      return {
        ...state,
        loading: true,
      };
    case 'CANCEL_ORDER_SUCCESS':
    case 'RETURN_ORDER_SUCCESS':
    case 'CANCEL_RETURN_SUCCESS':
      return {
        ...state,
        loading: false,
        ...action.payload,
      };
    case 'CLEAR_SUCCESS':
      return {
        ...state,
        success: null,
      };
    case 'CANCEL_ORDER_FAILURE':
    case 'RETURN_ORDER_FAILURE':
    case 'CANCEL_RETURN_FAILURE':
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
      return {};

    default:
      return state;
  }
};

// get all orders of the current user
export const myOrdersReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case 'MY_ORDERS_REQUEST':
      return {
        loading: true,
      };
    case 'MY_ORDERS_SUCCESS':
      const { success, message, orders } = action.payload;
      return {
        ...state,
        loading: false,
        orders,
        success,
        message,
      };
    case 'MY_ORDERS_FAILURE':
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
      return { orders: [] };
    default:
      return state;
  }
};

// get all orders (Admin)
export const allOrdersReducer = (state = {}, action) => {
  switch (action.type) {
    case 'GET_ALL_ORDERS_REQUEST':
      return {
        loading: true,
      };
    case 'GET_ALL_ORDERS_SUCCESS':
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
    case 'GET_ALL_ORDERS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null,
        success: false,
      };

    case 'CLEAR_STATE':
      return {};
    default:
      return state;
  }
};

// Get all return requests (Admin)
export const returnRequestsReducer = (state = [], action) => {
  switch (action.type) {
    case 'GET_RETURN_REQUESTS_REQUEST':
      return {
        loading: true,
        ...state,
      };
    case 'GET_RETURN_REQUESTS_SUCCESS':
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
    case 'GET_RETURN_REQUESTS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null,
        success: false,
      };

    case 'CLEAR_STATE':
      return [];
    default:
      return state;
  }
};

// Update/delete orders
export const orderReducer = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_ORDER_REQUEST':
    case 'DELETE_ORDER_REQUEST':
    case 'MANAGE_RETURN_REQUEST':
      return {
        loading: true,
      };
    case 'DELETE_ORDER_SUCCESS':
      return {
        loading: false,
        isDeleted: action.payload,
      };
    case 'UPDATE_ORDER_SUCCESS':
      return {
        loading: false,
        isUpdated: action.payload,
      };
    case 'MANAGE_RETURN_SUCCESS':
      return {
        loading: false,
        success: true,
        ...action.payload,
      };

    case 'UPDATE_ORDER_FAILURE':
    case 'DELETE_ORDER_FAILURE':
    case 'MANAGE_RETURN_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'UPDATE_ORDER_RESET':
    case 'MANAGE_RETURN_RESET':
      return {
        isUpdated: false,
      };

    case 'DELETE_ORDER_RESET':
      return {
        isDeleted: false,
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null,
        success: false,
      };

    case 'CLEAR_STATE':
      return {};
    default:
      return state;
  }
};

// get order details
export const orderDetailsReducer = (
  state = { order: {}, error: false, loading: false },
  action,
) => {
  switch (action.type) {
    case 'ORDER_DETAILS_REQUEST':
      return {
        ...state,
        loading: true,
      };
    case 'ORDER_DETAILS_SUCCESS':
      const { success, message, order } = action.payload;
      return {
        ...state,
        loading: false,
        order,
        success,
        message,
      };
    case 'ORDER_DETAILS_FAILURE':
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
      return { order: {}, error: false, loading: false };
    default:
      return state;
  }
};

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
        order: action.payload,
      };
    case 'CREATE_ORDER_FAILURE':
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
    default:
      return state;
  }
};

// get order details
export const orderDetailsReducer = (state = { order: {} }, action) => {
  switch (action.type) {
    case 'ORDER_DETAILS_REQUEST':
      return {
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
    default:
      return state;
  }
};

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
export const myOrderReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case 'MY_ORDERS_REQUEST':
      return {
        loading: true,
      };
    case 'MY_ORDERS_SUCCESS':
      return {
        ...state,
        loading: false,
        orders: action.payload,
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

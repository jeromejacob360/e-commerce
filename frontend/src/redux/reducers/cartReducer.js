export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case 'ADD_TO_CART_REQUEST':
      return {
        ...state,
        loading: true,
      };

    case 'LOAD_CART_SUCCESS':
    case 'ADD_TO_CART_SUCCESS':
      return {
        loading: false,
        cartItems: action.payload,
      };

    case 'ADD_TO_CART_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case 'CLEAR_CART_ERRORS':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

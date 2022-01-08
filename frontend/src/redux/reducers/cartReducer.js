export const cartReducer = (
  state = { cartItems: [], loading: false, completed: false },
  action,
) => {
  switch (action.type) {
    case 'ADD_TO_CART_REQUEST':
      return {
        ...state,
        loading: true,
        completed: false,
      };

    case 'ADD_TO_CART_SUCCESS':
      return {
        loading: false,
        cartItems: action.payload,
        completed: true,
      };

    case 'LOAD_CART_SUCCESS':
      return {
        ...state,
        loading: false,
        cartItems: action.payload,
      };

    case 'ADD_TO_CART_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
        completed: false,
      };

    case 'REMOVE_FROM_CART_REQUEST':
      return {
        ...state,
        loading: true,
        completed: false,
      };

    case 'REMOVE_FROM_CART_SUCCESS':
      return {
        loading: false,
        cartItems: action.payload,
        completed: true,
      };

    case 'REMOVE_FROM_CART_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
        completed: false,
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

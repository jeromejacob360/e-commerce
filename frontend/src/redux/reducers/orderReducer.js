export const orderReducer = (state = {}, action) => {
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
    default:
      return state;
  }
};

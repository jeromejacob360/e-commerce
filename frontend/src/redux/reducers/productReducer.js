export const productReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case 'ALL_PRODUCT_REQUEST':
      return {
        loading: true,
        products: [],
      };
    case 'ALL_PRODUCT_SUCCESS':
      return {
        loading: false,
        ...action.payload,
      };
    case 'ALL_PRODUCT_FAILURE':
      return {
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

export const detailsReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case 'PRODUCT_DETAILS_REQUEST':
      return { ...state, loading: true };
    case 'PRODUCT_DETAILS_SUCCESS':
      return {
        loading: false,
        product: action.payload,
      };
    case 'PRODUCT_DETAILS_FAILURE':
      return {
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

export const newReviewReducer = (state = { reviews: [] }, action) => {
  switch (action.type) {
    case 'NEW_REVIEW_REQUEST':
      return { ...state, loading: true, error: null, success: false };
    case 'NEW_REVIEW_SUCCESS':
      return {
        loading: false,
        success: action.payload.success,
      };
    case 'NEW_REVIEW_FAILURE':
      return {
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

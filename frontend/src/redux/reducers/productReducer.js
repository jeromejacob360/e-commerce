export const productsReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case 'ALL_PRODUCT_REQUEST':
    case 'ADMIN_PRODUCTS_REQUEST':
      return {
        loading: true,
        products: [],
      };
    case 'ALL_PRODUCT_SUCCESS':
    case 'ADMIN_PRODUCTS_SUCCESS':
      return {
        loading: false,
        ...action.payload,
      };
    case 'ALL_PRODUCT_FAILURE':
    case 'ADMIN_PRODUCTS_FAILURE':
      return {
        loading: false,
        error: action.payload,
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null,
      };

    case 'CLEAR_STATE':
      return { products: [] };
    default:
      return state;
  }
};

// Create a product (admin only)
export const newProductReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case 'NEW_PRODUCT_REQUEST':
      return {
        loading: true,
      };
    case 'NEW_PRODUCT_SUCCESS':
      return {
        loading: false,
        success: true,
        ...action.payload,
      };
    case 'NEW_PRODUCT_FAILURE':
      return {
        loading: false,
        error: action.payload,
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null,
      };
    case 'CLEAR_PRODUCT':
      return {
        product: {},
      };

    default:
      return state;
  }
};

// Delete a product (admin only)
export const productReducer = (state = {}, action) => {
  switch (action.type) {
    case 'DELETE_PRODUCT_REQUEST':
    case 'UPDATE_PRODUCT_REQUEST':
      return {
        loading: true,
      };
    case 'DELETE_PRODUCT_SUCCESS':
    case 'UPDATE_PRODUCT_SUCCESS':
      return {
        loading: false,
        ...action.payload,
      };
    case 'DELETE_PRODUCT_FAILURE':
    case 'UPDATE_PRODUCT_FAILURE':
      return {
        loading: false,
        error: action.payload,
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null,
      };
    case 'CLEAR_PRODUCT':
      return {
        product: {},
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
    case 'CLEAR_STATE':
      return { products: [] };
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

    case 'CLEAR_NEW_REVIEW':
      return {
        loading: false,
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

// Get all reviews of a product
export const productReviewsReducer = (state = { reviews: [] }, action) => {
  switch (action.type) {
    case 'PRODUCT_REVIEWS_REQUEST':
      return { loading: true };
    case 'PRODUCT_REVIEWS_SUCCESS':
      return {
        loading: false,
        ...action.payload,
      };
    case 'PRODUCT_REVIEWS_FAILURE':
      return {
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

// Delete a review
export const reviewReducer = (state = {}, action) => {
  switch (action.type) {
    case 'DELETE_REVIEW_REQUEST':
      return { loading: true };
    case 'DELETE_REVIEW_SUCCESS':
      return {
        loading: false,
        ...action.payload,
      };
    case 'DELETE_REVIEW_FAILURE':
      return {
        loading: false,
        error: action.payload,
      };

    case 'CLEAR_REVIEWS':
      return {};

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

import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  productsReducer,
  productReducer,
  detailsReducer,
  newReviewReducer,
  newProductReducer,
  productReviewsReducer,
  reviewReducer,
} from './reducers/productReducer';
import {
  allUsersReducer,
  forgotPasswordReducer,
  profileReducer,
  userReducer,
  usersReviewsReducer,
} from './reducers/userReducer';
import { cartReducer } from './reducers/cartReducer';
import {
  allOrdersReducer,
  cancelOrderReducer,
  myOrdersReducer,
  newOrderReducer,
  orderDetailsReducer,
  orderReducer,
  returnRequestsReducer,
} from './reducers/orderReducer';

const reducer = combineReducers({
  products: productsReducer,
  productDetails: detailsReducer,
  user: userReducer,
  forgotPassword: forgotPasswordReducer,
  cart: cartReducer,
  newOrder: newOrderReducer,
  myOrders: myOrdersReducer,
  orderDetails: orderDetailsReducer,
  newReview: newReviewReducer,
  newProduct: newProductReducer,
  product: productReducer,
  allOrders: allOrdersReducer,
  allUsers: allUsersReducer,
  order: orderReducer,
  returnRequests: returnRequestsReducer,
  cancelOrder: cancelOrderReducer,
  profile: profileReducer,
  productReviews: productReviewsReducer,
  reviews: reviewReducer,
  usersReviews: usersReviewsReducer,
});

const initialState = {};

const middlewares = [thunk];

const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 50 });

const store = createStore(
  reducer,
  initialState,
  composeEnhancers(applyMiddleware(...middlewares)),
);

export default store;

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
  myOrdersReducer,
  newOrderReducer,
  orderDetailsReducer,
  orderReducer,
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
  profile: profileReducer,
  productReviews: productReviewsReducer,
  reviews: reviewReducer,
  usersReviews: usersReviewsReducer,
});

const initialState = {};

const middlewares = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middlewares)),
);

export default store;

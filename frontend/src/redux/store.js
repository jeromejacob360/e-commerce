import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { productReducer, detailsReducer } from './reducers/productReducer';
import { userReducer } from './reducers/userReducer';
import { cartReducer } from './reducers/cartReducer';
import { orderReducer } from './reducers/orderReducer';

const reducer = combineReducers({
  products: productReducer,
  productDetails: detailsReducer,
  user: userReducer,
  cart: cartReducer,
  order: orderReducer,
});

const initialState = {};

const middlewares = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middlewares)),
);

export default store;

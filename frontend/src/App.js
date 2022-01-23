import Navbar from './components/Navbar';
import Home from './components/Home';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import ProductDetails from './components/ProductDetails';
import Products from './components/products';
import Search from './components/search';
import LoginSignup from './components/LoginSignup';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './redux/actions/userActions';
import ProtectedRoute from './helper-components/protectedRoute';
import Profile from './components/Account';
import UpdateProfile from './components/updateProfile';
import Cart from './components/Cart';
import { loadCart } from './redux/actions/cartActions';
import Checkout from './components/Checkout';
import Confirm from './components/Confirm.js';
import Payment from './components/Payment';
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import OrderSuccess from './components/OrderSuccess';
import FourOFour from './components/404';
import MyOrders from './components/MyOrders';
import OrderDetails from './components/orderDetails';
import Dashboard from './components/admin/Dashboard';
import ProductsList from './components/admin/ProductsList';
import UpdateProduct from './components/admin/UpdateProduct';
import CreateProduct from './components/admin/CreateProduct';
import OrdersList from './components/admin/OrderList';
import UsersList from './components/admin/UsersList';
import ReviewsList from './components/admin/ReviewsList';
import ProcessOrder from './components/admin/ProcessOrder';
import ErrorBoundary from './components/ErrorBoundary';
import UserReviews from './components/UserReviews';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [stripeApiKey, setStripeApiKey] = useState('');

  console.warn = (message) => {
    if (!message.toLowerCase().includes('stripe')) {
      console.warn(message);
    } else return false;
  };

  useEffect(() => {
    if (isAuthenticated === true) {
      dispatch(loadCart());
      getStripeApiKey();
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  async function getStripeApiKey() {
    const { data } = await axios.get('/api/stripeApiKey');
    setStripeApiKey(data.stripeApiKey);
  }

  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <Navbar />
        {stripeApiKey && (
          <Elements stripe={loadStripe(stripeApiKey)}>
            <Route exact path="/payment" component={Payment} />
          </Elements>
        )}
        <div className="max max-w-[1920px] mx-auto mt-24">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={LoginSignup} />
            <Route exact path="/search" component={Search} />
            <Route exact path="/products" component={Products} />
            <Route exact path="/products/:keyword" component={Products} />
            <Route exact path="/product/:id" component={ProductDetails} />
            <ProtectedRoute
              exact
              path="/admin/order/:id"
              component={ProcessOrder}
            />
            <ProtectedRoute exact path="/cart" component={Cart} />
            <ProtectedRoute exact path="/account" component={Profile} />
            <ProtectedRoute
              exact
              path="/checkout/confirm"
              component={Confirm}
            />
            <ProtectedRoute exact path="/checkout" component={Checkout} />
            <ProtectedRoute exact path="/success" component={OrderSuccess} />
            <ProtectedRoute exact path="/me/update" component={UpdateProfile} />
            <ProtectedRoute exact path="/me/reviews" component={UserReviews} />
            <ProtectedRoute exact path="/orders/me" component={MyOrders} />
            <ProtectedRoute exact path="/order/:id" component={OrderDetails} />
            <ProtectedRoute
              exact
              path="/admin/dashboard"
              component={Dashboard}
            />
            <ProtectedRoute
              exact
              path="/admin/products"
              component={ProductsList}
            />
            <ProtectedRoute
              exact
              path="/admin/product/:id"
              component={UpdateProduct}
            />
            <ProtectedRoute
              exact
              path="/admin/product"
              component={CreateProduct}
            />
            <ProtectedRoute exact path="/admin/orders" component={OrdersList} />
            <ProtectedRoute exact path="/admin/users" component={UsersList} />
            <ErrorBoundary>
              <ProtectedRoute
                exact
                path="/admin/reviews"
                component={ReviewsList}
              />
            </ErrorBoundary>
            <Route
              component={
                window.location.pathname === '/payment' ? null : FourOFour
              }
            />
          </Switch>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;

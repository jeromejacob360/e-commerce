import './App.css';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import ProductDetails from './components/productDetails/ProductDetails';
import Products from './components/products/products';
import Search from './components/search/search';
import LoginSignup from './components/user/LoginSignup';
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

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [stripeApiKey, setStripeApiKey] = useState('');

  useEffect(() => {
    dispatch(loadCart());
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    getStripeApiKey();
  }, []);

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
            <ProtectedRoute exact path="/payment" component={Payment} />
          </Elements>
        )}
        <div className="max max-w-[1920px] mx-auto">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={LoginSignup} />
            <Route exact path="/search" component={Search} />
            <Route exact path="/products" component={Products} />
            <Route exact path="/products/:keyword" component={Products} />
            <Route exact path="/product/:id" component={ProductDetails} />
            <Route exact path="/cart" component={Cart} />

            <ProtectedRoute exact path="/account" component={Profile} />
            <ProtectedRoute exact path="/checkout" component={Checkout} />
            <ProtectedRoute
              exact
              path="/checkout/confirm"
              component={Confirm}
            />
            <ProtectedRoute exact path="/success" component={OrderSuccess} />
            <ProtectedRoute exact path="/me/update" component={UpdateProfile} />
            <ProtectedRoute exact path="/orders/me" component={MyOrders} />
            <ProtectedRoute exact path="/order/:id" component={OrderDetails} />
            {!stripeApiKey && <Route component={FourOFour} />}
          </Switch>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;

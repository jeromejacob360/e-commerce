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
import Dashboard from './components/admin/Dashboard';
import AdminRoute from './helper-components/AdminRoute';
import ProductsList from './components/admin/ProductsList';
import CreateProduct from './components/admin/CreateProduct';
import UpdateProduct from './components/admin/UpdateProduct';
import OrdersList from './components/admin/OrderList';
import ProcessOrder from './components/admin/ProcessOrder';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [stripeApiKey, setStripeApiKey] = useState('');

  useEffect(() => {
    if (isAuthenticated === true) {
      dispatch(loadCart());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      getStripeApiKey();
    }
  }, [isAuthenticated]);

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

            <ProtectedRoute>
              <Route exact path="/cart" component={Cart} />
              <Route exact path="/account" component={Profile} />
              <Route exact path="/checkout" component={Checkout} />
              <Route exact path="/checkout/confirm" component={Confirm} />
              <Route exact path="/success" component={OrderSuccess} />
              <Route exact path="/me/update" component={UpdateProfile} />
              <Route exact path="/orders/me" component={MyOrders} />
              <Route exact path="/order/:id" component={OrderDetails} />
              <AdminRoute>
                <Route exact path="/admin/dashboard" component={Dashboard} />
                <Route exact path="/admin/products" component={ProductsList} />
                <Route exact path="/admin/product" component={CreateProduct} />
                <Route
                  exact
                  path="/admin/product/:id"
                  component={UpdateProduct}
                />

                <Route exact path="/admin/orders" component={OrdersList} />
                <Route exact path="/admin/order/:id" component={ProcessOrder} />
              </AdminRoute>
            </ProtectedRoute>
            {!stripeApiKey && <Route component={FourOFour} />}
          </Switch>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;

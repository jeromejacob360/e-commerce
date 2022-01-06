import './App.css';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';
import { BrowserRouter, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import ProductDetails from './components/productDetails/ProductDetails';
import Products from './components/products/products';
import Search from './components/search/search';
import LoginSignup from './components/user/LoginSignup';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadUser } from './redux/actions/userActions';
import ProtectedRoute from './helper-components/protectedRoute';
import Profile from './components/Account';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);
  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <Navbar />
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={LoginSignup} />
        <Route exact path="/search" component={Search} />
        <Route exact path="/products" component={Products} />
        <Route exact path="/products/:keyword" component={Products} />
        <Route exact path="/product/:id" component={ProductDetails} />

        <ProtectedRoute exact path="/account" component={Profile} />
      </BrowserRouter>
    </>
  );
}

export default App;

import './App.css';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import ProductDetails from './components/productDetails/ProductDetails';
import Products from './components/products/products';
import Search from './components/search/search';

function App() {
  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/search" component={Search} />
          <Route exact path="/products" component={Products} />
          <Route exact path="/products/:keyword" component={Products} />
          <Route exact path="/product/:id" component={ProductDetails} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;

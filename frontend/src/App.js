import './App.css';
import Navbar from './components/Navbar';
import Home from './components/home/Home';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import ProductDetails from './components/productDetails/ProductDetails';

function App() {
  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/product/:id" component={ProductDetails} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;

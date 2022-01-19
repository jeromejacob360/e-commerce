import { Route, Switch } from 'react-router-dom';
import Sidebar from './Sidebar';
import ErrorBoundary from '../ErrorBoundary';

import ProductsList from './ProductsList';
import Dashboard from './Dashboard';
import CreateProduct from './CreateProduct';
import UpdateProduct from './UpdateProduct';
import ProcessOrder from './ProcessOrder';
import OrdersList from './OrderList';
import UsersList from './UsersList';
import ReviewsList from './ReviewsList';

export default function DashboardWrapper() {
  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 xl:px-20">
        <Switch>
          <Route path="/admin/dashboard" component={Dashboard} />
          <Route path="/admin/products" component={ProductsList} />
          <Route path="/admin/product/:id" component={UpdateProduct} />
          <Route path="/admin/product" component={CreateProduct} />
          <Route path="/admin/orders" component={OrdersList} />
          <Route path="/admin/users" component={UsersList} />
          <ErrorBoundary>
            <Route path="/admin/reviews" component={ReviewsList} />
          </ErrorBoundary>
          <Route path="/admin/order/:id" component={ProcessOrder} />
        </Switch>
      </div>
    </div>
  );
}

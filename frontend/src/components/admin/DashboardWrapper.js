import { Route, Switch } from 'react-router-dom';
import Sidebar from './Sidebar';

import ProductsList from './ProductsList';
import Dashboard from './Dashboard';
import CreateProduct from './CreateProduct';
import UpdateProduct from './UpdateProduct';
import ProcessOrder from './ProcessOrder';
import OrdersList from './OrderList';

export default function DashboardWrapper({ component: Component }) {
  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 md:px-20">
        <Switch>
          <Route path="/admin/dashboard">
            <Dashboard />
          </Route>
          <Route path="/admin/products">
            <ProductsList />
          </Route>
          <Route
            path="/admin/product/:id"
            render={(match) => <UpdateProduct propsFromRouter={match} />}
          />

          <Route path="/admin/product">
            <CreateProduct />
          </Route>
          <Route path="/admin/orders">
            <OrdersList />
          </Route>
          <Route
            path="/admin/order/:id"
            render={(match) => <ProcessOrder propsFromRouter={match} />}
          />
        </Switch>
      </div>
    </div>
  );
}

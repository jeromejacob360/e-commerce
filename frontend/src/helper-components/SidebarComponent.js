import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReviewsIcon from '@mui/icons-material/Reviews';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PeopleIcon from '@mui/icons-material/People';
import RedeemIcon from '@mui/icons-material/Redeem';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';

export default function SidebarComponent() {
  return (
    <>
      <div className="flex flex-col items-start pl-4 space-y-8">
        <Link to="/admin/dashboard">
          <p className="flex">
            <DashboardIcon /> <span className="ml-2">Dashboard</span>
          </p>
        </Link>
        <Link to="/admin/products" className="w-full">
          <p className="flex items-center space-x-2">
            <RedeemIcon />
            <span>All products</span>
          </p>
        </Link>
        <Link to="/admin/product" className="w-full">
          <p className="flex items-center space-x-2">
            <AddBoxIcon />
            <span>Create product</span>
          </p>
        </Link>
        <Link to="/admin/orders" className="w-full">
          <p className="flex items-center space-x-2">
            <Inventory2Icon />
            <span>Orders</span>
          </p>
        </Link>
        <Link to="/admin/returns" className="w-full">
          <p className="flex items-center space-x-2">
            <AssignmentReturnIcon />
            <span>Return requests</span>
          </p>
        </Link>
        <Link to="/admin/users" className="w-full">
          <p className="flex items-center space-x-2">
            <PeopleIcon />
            <span>Users</span>
          </p>
        </Link>
        <Link to="/admin/reviews" className="w-full">
          <p className="flex items-center space-x-2">
            <ReviewsIcon />
            <span>Reviews</span>
          </p>
        </Link>
      </div>
    </>
  );
}

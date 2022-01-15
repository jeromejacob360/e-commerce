import { TreeView, TreeItem } from '@material-ui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReviewsIcon from '@mui/icons-material/Reviews';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PeopleIcon from '@mui/icons-material/People';
import DensitySmallIcon from '@mui/icons-material/DensitySmall';
import AddIcon from '@mui/icons-material/Add';

export default function SidebarComponent() {
  return (
    <>
      <div className="flex flex-col items-center pl-4 space-y-8">
        <Link to="/admin/dashboard">
          <p className="flex">
            <DashboardIcon /> <span className="ml-2">Dashboard</span>
          </p>
        </Link>
        <TreeView
          aria-label="Admin dashboard sidebar"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        >
          <TreeItem nodeId="1" label="Products">
            <div className="my-4">
              <Link to="/admin/products">
                <TreeItem nodeId="2" label="All" icon={<DensitySmallIcon />} />
              </Link>
            </div>

            <Link to="/admin/product">
              <TreeItem nodeId="3" label="Create" icon={<AddIcon />} />
            </Link>
          </TreeItem>
        </TreeView>
        <Link to="/admin/orders">
          <p className="flex items-center space-x-2">
            <Inventory2Icon />
            <span>Orders</span>
          </p>
        </Link>
        <Link to="/admin/users">
          <p className="flex items-center space-x-2">
            <PeopleIcon />
            <span>Users</span>
          </p>
        </Link>
        <Link to="/admin/reviews">
          <p className="flex items-center space-x-2">
            <ReviewsIcon />
            <span>Reviews</span>
          </p>
        </Link>
      </div>
    </>
  );
}

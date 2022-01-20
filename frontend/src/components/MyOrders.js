import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, getMyOrders } from '../redux/actions/orderActions';
import { DataGrid } from '@mui/x-data-grid';
import Loading from '../helper-components/Loading';
import { useSnackbar } from 'notistack';
import Metadata from '../helper-components/metadata';
import { Link } from 'react-router-dom';
import LaunchIcon from '@mui/icons-material/Launch';

export default function MyOrders() {
  const { loading, orders, error } = useSelector((state) => state.myOrders);
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const enqueueSnackbar = useSnackbar();

  useEffect(() => {
    dispatch(getMyOrders());

    if (error) {
      enqueueSnackbar(error, {
        variant: 'error',
      });
      dispatch(clearErrors());
    }
  }, [dispatch, enqueueSnackbar, error]);

  const rows = [];
  orders &&
    orders.forEach((item) => {
      rows.push({
        itemsQty: item.orderItems.length,
        id: item._id,
        status: item.orderStatus,
        amount: item.totalPrice,
      });
    });

  const columns = [
    { field: 'id', headerName: 'Order ID', minWidth: 200, flex: 1 },

    {
      field: 'status',
      headerName: 'Status',
      minWidth: 100,
      flex: 0.5,
      cellClassName: (params) => {
        return params.getValue(params.id, 'status') === 'Delivered'
          ? 'text-green-700'
          : 'text-red-800';
      },
    },
    {
      field: 'itemsQty',
      headerName: 'Quantity',
      type: 'number',
      minWidth: 80,
      flex: 0.3,
    },

    {
      field: 'amount',
      headerName: 'Amount (₹)',
      type: 'number',
      minWidth: 100,
      flex: 0.5,
    },

    {
      field: 'actions',
      flex: 0.3,
      headerName: 'Actions',
      minWidth: 70,
      type: 'text',
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/order/${params.id}`}>
            <LaunchIcon />
          </Link>
        );
      },
    },
  ];

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="py-2 my-4 text-2xl font-bold text-center">My Orders</h1>
      <Metadata title={'Orders - ' + user.name} />
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
}

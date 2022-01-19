import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors } from '../../redux/actions/productActions';
import Loading from '../../helper-components/loading/Loading';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PageTitle from '../../helper-components/PageTitle';
import { useSnackbar } from 'notistack';
import { Button } from '@mui/material';
import { deleteOrder, getAllOrders } from '../../redux/actions/orderActions';
import Sidebar from './Sidebar';

export default function OrdersList() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { loading, orders } = useSelector((state) => state.allOrders);
  const { isDeleted, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch, isDeleted]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar('Delete operation failed', { variant: 'error' });
      dispatch(clearErrors());
    }

    if (isDeleted) {
      enqueueSnackbar('Order deleted', { variant: 'success' });
      dispatch({
        type: 'DELETE_ORDER_RESET',
      });
    }
  }, [error, enqueueSnackbar, dispatch, isDeleted]);

  function deleteHandler(id) {
    dispatch(deleteOrder(id));
  }

  const rows = [];
  orders &&
    orders.forEach((item) => {
      rows.push({
        id: item._id,
        name: item.orderItems.map((item) => item.name),
        status: item.orderStatus,
        itemsQty: item.orderItems.length,
        amount: item.totalPrice,
      });
    });

  const columns = [
    { field: 'id', headerName: 'Order ID', minWidth: 200, flex: 1 },
    { field: 'name', headerName: 'Items', minWidth: 200, flex: 1 },

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
      minWidth: 100,
      type: 'text',
      sortable: false,
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-between flex-1 px-2 text-gray-500">
            <Link to={`/admin/order/${params.row.id}`}>
              <EditIcon />
            </Link>
            <Button onClick={() => deleteHandler(params.row.id)}>
              <DeleteOutlineIcon />
            </Button>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 xl:px-20">
        {loading ? (
          <Loading />
        ) : (
          <div>
            <PageTitle title="All Orders" />
            <div className="flex-1">
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                disableSelectionOnClick
                autoHeight
                getRowClassName={(params) =>
                  params.row.stock < 1 ? 'bg-red-400 bg-opacity-10' : ''
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

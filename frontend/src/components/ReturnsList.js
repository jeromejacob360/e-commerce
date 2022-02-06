import { MenuItem, Select } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../helper-components/Loading';
import PageTitle from '../helper-components/PageTitle';
import {
  clearErrors,
  getAllReturnRequests,
  manageReturnRequest,
} from '../redux/actions/orderActions';
import Sidebar from './admin/Sidebar';

export default function ReturnsList() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { returnRequests, loading, error, success } = useSelector(
    (state) => state.returnRequests,
  );

  useEffect(() => {
    dispatch(getAllReturnRequests());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      dispatch(clearErrors());
    }
  }, [error, enqueueSnackbar, dispatch, success]);

  function handleReturnRequest(productId, orderId, status) {
    console.log('productId, orderId, status', productId, orderId, status);
    dispatch(manageReturnRequest(productId, orderId, status));
  }

  const rows = [];
  returnRequests &&
    returnRequests.forEach((returnRequest, index) => {
      rows.push({
        id: index + 1,
        productId: returnRequest.orderItems.productId,
        orderId: returnRequest._id,
        description:
          returnRequest.orderItems.name +
          ' ' +
          returnRequest.orderItems.description,
        price: returnRequest.orderItems.price,
        // quantity: returnRequest.orderItems.quantity,
        // Image: returnRequest.orderItems.image,
        // reason: returnRequest.orderItems.reason,
        user: returnRequest.user,
      });
    });

  const columns = [
    {
      field: 'productId',
      headerName: 'ProductId',
      minWidth: 200,
      flex: 0.3,
    },

    {
      field: 'description',
      headerName: 'About',
      minWidth: 180,
      flex: 0.3,
    },
    {
      field: 'price',
      headerName: 'Price',
      type: 'number',
      minWidth: 90,
      flex: 0.3,
    },
    // {
    //   field: 'quantity',
    //   headerName: 'Quantity',
    //   minWidth: 90,
    //   flex: 0.3,
    // },
    {
      field: 'description',
      headerName: 'Description',
      minWidth: 180,
      flex: 0.3,
    },
    // {
    //   field: 'Image',
    //   headerName: 'Image',
    //   minWidth: 90,
    //   flex: 0.3,
    //   renderCell: (params) => {
    //     return (
    //       <img
    //         className="object-contain w-8 h-10"
    //         src={params.row.Image}
    //         alt="product"
    //       />
    //     );
    //   },
    // },
    // {
    //   field: 'reason',
    //   headerName: 'Reason',
    //   minWidth: 180,
    //   flex: 0.3,
    // },
    {
      field: 'user',
      headerName: 'User',
      minWidth: 180,
      flex: 0.3,
    },

    {
      field: 'action',
      headerName: 'Action',
      type: 'text',
      minWidth: 100,
      flex: 0.5,
      headerAlign: 'center',

      renderCell: (params) => {
        return (
          <>
            <Select
              name="action"
              fullWidth
              value={params.row.action}
              displayEmpty
              onChange={(e) =>
                handleReturnRequest(
                  params.row.orderId,
                  params.row.productId,
                  e.target.value,
                )
              }
            >
              <MenuItem disabled>Select</MenuItem>
              <MenuItem value="accepted">Accept</MenuItem>
              <MenuItem value="rejected">Reject</MenuItem>
            </Select>
          </>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col">
      <PageTitle title="Return requests" />
      <div className="flex flex-col sm:flex-row 2xl:px-10">
        <Sidebar />
        {loading ? (
          <Loading />
        ) : (
          <div className="flex-1 sm:ml-44">
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={rowsPerPage}
              onPageSizeChange={(number) => setRowsPerPage(number)}
              rowsPerPageOptions={[5, 10, 20, 50, 100]}
              disableSelectionOnClick
              autoHeight
              getRowClassName={(params) =>
                params.row.stock < 1 ? 'bg-red-400 bg-opacity-10' : ''
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}

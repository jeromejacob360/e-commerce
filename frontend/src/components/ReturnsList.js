import { MenuItem, Select } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageTitle from '../helper-components/PageTitle';
import {
  clearErrors,
  getAllReturnRequests,
  manageReturnRequest,
} from '../redux/actions/orderActions';
import Sidebar from './admin/Sidebar';
import { Link } from 'react-router-dom';
import { fetchProductDetails } from '../redux/actions/productActions';
import LoadingSpinner from '../helper-components/LoadingSpinner';

export default function ReturnsList() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { returnRequests, loading, error, success } = useSelector(
    (state) => state.returnRequests,
  );
  const {
    loading: updateLoading,
    error: updateError,
    success: updateSuccess,
    message: updateMessage,
  } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getAllReturnRequests());
  }, [dispatch, updateSuccess]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      dispatch(clearErrors());
    }
    if (updateError) {
      enqueueSnackbar(updateError, { variant: 'error' });
      dispatch(clearErrors());
    }
    if (updateSuccess) {
      enqueueSnackbar(updateMessage, { variant: 'success' });
      dispatch(clearErrors());
    }
  }, [
    error,
    enqueueSnackbar,
    dispatch,
    success,
    updateError,
    updateSuccess,
    updateMessage,
  ]);

  function handleReturnRequest(productId, orderId, status) {
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
        user: returnRequest.user,
        status: returnRequest.orderItems.status,
      });
    });

  const columns = [
    {
      field: 'productId',
      headerName: 'ProductId',
      minWidth: 200,
      flex: 0.3,
      renderCell: (rowData) => {
        return (
          <Link
            onMouseEnter={() =>
              dispatch(fetchProductDetails(rowData.row.productId))
            }
            to={`/product/${rowData.row.productId}`}
          >
            {rowData.row.productId}
          </Link>
        );
      },
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
    {
      field: 'description',
      headerName: 'Description',
      minWidth: 180,
      flex: 0.3,
    },
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
      minWidth: 180,
      flex: 0.5,
      headerAlign: 'center',

      renderCell: (params) => {
        if (
          params.row.status === 'Return rejected' ||
          params.row.status === 'Returned'
        ) {
          return params.row.status;
        }
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
              <MenuItem disabled>{params.row.status}</MenuItem>
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
        {
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
        }
      </div>
      {(loading || updateLoading) && <LoadingSpinner />}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearErrors,
  deleteProduct,
  fetchAdminProducts,
} from '../../redux/actions/productActions';
import Loading from '../../helper-components/Loading';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PageTitle from '../../helper-components/PageTitle';
import { useSnackbar } from 'notistack';
import { Button } from '@mui/material';
import Sidebar from './Sidebar';

export default function ProductsList() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { loading, products } = useSelector((state) => state.products);
  const { success, error, message } = useSelector((state) => state.product);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch, success]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      dispatch(clearErrors());
    }
    if (success) {
      enqueueSnackbar(message, { variant: 'success' });
      dispatch(clearErrors());
    }
  }, [dispatch, enqueueSnackbar, error, message, success]);

  function deleteHandler(id) {
    dispatch(deleteProduct(id));
  }

  const rows = [];
  products &&
    products.forEach((product) => {
      rows.push({
        id: product._id,
        name: product.name,
        price: product.price,
        rating: product.rating,
        stock: product.stock,
      });
    });

  const columns = [
    {
      field: 'id',
      headerName: 'Product ID',
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        return (
          <Link data-testid="productLink" to={`/product/${params.row.id}`}>
            <span>{params.value}</span>
          </Link>
        );
      },
    },

    {
      field: 'name',
      headerName: 'Name',
      minWidth: 100,
      flex: 0.5,
    },
    {
      field: 'price',
      headerName: 'Price (₹)',
      type: 'number',
      minWidth: 80,
      flex: 0.3,
    },

    {
      field: 'rating',
      headerName: 'Rating',
      type: 'number',
      minWidth: 100,
      flex: 0.5,
      headerAlign: 'center',
      renderCell: (params) => {
        const rating = params.row.rating;
        return (
          <div className="flex justify-center flex-1">
            <span>{rating ? rating : 'Nil'}</span>
          </div>
        );
      },
      cellClassName: (params) => {
        return params.value >= 4 ? 'text-green-700' : 'text-red-800';
      },
    },

    {
      field: 'stock',
      flex: 0.3,
      headerName: 'Stock',
      minWidth: 70,
      type: 'number',
      headerAlign: 'center',
      cellClassName: (params) => {
        return params.row.stock < 10 ? 'bg-red-200' : '';
      },
      renderCell: (params) => {
        return (
          <div className="flex justify-center flex-1">
            <span>{params.value}</span>
          </div>
        );
      },
    },
    {
      field: 'actions',
      flex: 0.3,
      headerName: 'Actions',
      minWidth: 120,
      type: 'text',
      sortable: false,
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-between flex-1 px-2 text-gray-500">
            <Link to={`/admin/product/${params.row.id}`}>
              <EditIcon />
            </Link>
            <Button
              data-testid="product-delete-button"
              onClick={() => deleteHandler(params.row.id)}
            >
              <DeleteOutlineIcon />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col">
      <PageTitle title="All products" />
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

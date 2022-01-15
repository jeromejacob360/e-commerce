import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminProducts } from '../../redux/actions/productActions';
import Loading from '../../helper-components/loading/Loading';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function ProductsList() {
  const dispatch = useDispatch();
  const { loading, products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

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
    { field: 'id', headerName: 'Product ID', minWidth: 200, flex: 1 },

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
        return (
          <div className="flex flex-1 justify-center">
            <span>{params.value}</span>
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
          <div className="flex flex-1 justify-center">
            <span>{params.value}</span>
          </div>
        );
      },
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
          <div className="text-gray-500 flex flex-1 justify-between px-2">
            <Link to={`/admin/product/${params.row.id}`}>
              <EditIcon />
            </Link>
            <Link to={`/order/${params.id}`}>
              <DeleteOutlineIcon />
            </Link>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return <Loading />;
  }
  return (
    <div>
      <div className="justify-center flex">
        <h1 className="my-10 border-b px-10 text-3xl">All Products</h1>
      </div>
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
  );
}

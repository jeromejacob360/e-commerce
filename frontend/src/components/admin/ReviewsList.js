import PageTitle from '../../helper-components/PageTitle';
import { Button, MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearErrors,
  deleteReview,
  fetchAdminProducts,
  fetchProductDetails,
  fetchProductReviews,
} from '../../redux/actions/productActions';
import { useSnackbar } from 'notistack';
import Loading from '../../helper-components/Loading';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { DataGrid } from '@mui/x-data-grid';
import Sidebar from './Sidebar';
import ProductCard from '../../helper-components/productCard';

export default function ReviewsList() {
  const [pId, setPId] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const { loading, error, reviews } = useSelector(
    (state) => state.productReviews,
  );
  const { product, loading: detailsLoading } = useSelector(
    (state) => state.productDetails,
  );
  const { success, error: reviewDeleteError } = useSelector(
    (state) => state.reviews,
  );
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    if (pId?.length === 24) {
      dispatch(fetchProductReviews(pId));
      dispatch(fetchProductDetails(pId));
    }
    dispatch(fetchAdminProducts());
  }, [dispatch, pId, success]);

  function deleteHandler(rId) {
    dispatch(deleteReview(pId, rId));
  }

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      dispatch(clearErrors());
    }
    if (reviewDeleteError) {
      enqueueSnackbar(reviewDeleteError, { variant: 'error' });
      dispatch(clearErrors());
    }
    if (success) {
      enqueueSnackbar('Review deleted successfully', { variant: 'success' });
      dispatch({
        type: 'CLEAR_REVIEWS',
      });
    }
  }, [error, enqueueSnackbar, dispatch, success, reviewDeleteError]);

  const rows = [];
  reviews &&
    reviews.forEach((review) => {
      rows.push({
        id: review._id,
        User: review.name,
        Rating: review.rating,
        Review:
          review.reviewMessage.length > 20
            ? review?.reviewMessage?.substring(0, 10) + '...'
            : review?.reviewMessage,
      });
    });

  const columns = [
    {
      field: 'id',
      headerName: 'Review ID',
      minWidth: 250,
      flex: 1,
    },

    {
      field: 'User',
      headerName: 'User',
      minWidth: 150,
      flex: 0.5,
    },
    {
      field: 'Rating',
      headerName: 'Rating',
      type: 'number',
      minWidth: 80,
      flex: 0.3,
      renderCell: (params) => {
        const rating = params.row.Rating;
        return (
          <div>
            <span>{rating ? rating : 'Nil'}</span>
          </div>
        );
      },
      cellClassName: (params) => {
        return params.value >= 4 ? 'text-green-700' : 'text-red-800';
      },
    },

    {
      field: 'Review',
      headerName: 'Review',
      minWidth: 100,
      flex: 0.5,
    },

    {
      field: 'actions',
      headerAlign: 'center',
      flex: 0.3,
      headerName: 'Actions',
      minWidth: 80,
      type: 'text',
      sortable: false,
      renderCell: (params) => {
        return (
          <div className="flex justify-center flex-1">
            <Button onClick={() => deleteHandler(params.row.id)}>
              <DeleteOutlineIcon />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col">
      <PageTitle title="Reviews" />
      <div className="flex flex-col sm:flex-row 2xl:px-10">
        <Sidebar />
        {loading ? (
          <Loading />
        ) : (
          <div className="flex flex-col flex-1 sm:ml-44">
            <div className="flex flex-col sm:mx-10 xl:flex-row">
              <form className="flex flex-col items-center justify-center flex-1 w-full my-10 sm:flex-row">
                <Select
                  sx={{
                    m: 2,
                    width: {
                      xs: '100%',
                      md: '600px',
                    },
                  }}
                  name="category"
                  displayEmpty
                  renderValue={(value) =>
                    value ? (
                      value
                    ) : (
                      <div className="text-gray-400">Select a product</div>
                    )
                  }
                  value={pId}
                  onChange={(e) => setPId(e.target.value)}
                >
                  {products &&
                    products.map((product) => {
                      return (
                        <MenuItem key={product._id} value={product._id}>
                          <div className="flex items-center justify-between w-[500px] pr-4">
                            <span>{product._id}</span>
                            <img
                              className="object-contain w-8 h-8"
                              src={product.images[0].url}
                              alt=""
                            />
                            <span>{product.name}</span>
                            <span>{product.rating}</span>
                          </div>
                        </MenuItem>
                      );
                    })}
                </Select>
              </form>

              {product ? (
                <div className="flex items-center justify-center">
                  <ProductCard product={product} />
                </div>
              ) : detailsLoading ? (
                <Loading />
              ) : (
                <div className="h-[400px] w-80"></div>
              )}
            </div>
            {reviews ? (
              reviews?.length > 0 && (
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={rowsPerPage}
                  onPageSizeChange={(number) => setRowsPerPage(number)}
                  rowsPerPageOptions={[5, 10, 20, 50, 100]}
                  disableSelectionOnClick
                  autoHeight
                  getRowClassName={(params) =>
                    params.row.rating < 1 ? 'bg-red-400 bg-opacity-10' : ''
                  }
                />
              )
            ) : (
              <h4 className="text-xl text-center text-gray-600">
                No reviews found
              </h4>
            )}
            {reviews
              ? reviews.length === 0 &&
                pId && (
                  <h1 className="text-xl text-center text-gray-500 sm:text-2xl">
                    There are no reviews for the product yet
                  </h1>
                )
              : null}
          </div>
        )}
      </div>
    </div>
  );
}

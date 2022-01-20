import PageTitle from '../../helper-components/PageTitle';
import { Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearErrors,
  deleteReview,
  fetchProductReviews,
} from '../../redux/actions/productActions';
import { useSnackbar } from 'notistack';
import Loading from '../../helper-components/loading/Loading';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { DataGrid } from '@mui/x-data-grid';
import Sidebar from './Sidebar';

export default function ReviewsList() {
  const [pId, setPId] = useState('');

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const { loading, error, reviews } = useSelector(
    (state) => state.productReviews,
  );
  const { success, error: reviewDeleteError } = useSelector(
    (state) => state.reviews,
  );

  useEffect(() => {
    if (pId) if (pId.length === 24) dispatch(fetchProductReviews(pId));
  }, [dispatch, pId, success]);

  function handleSubmit(e) {
    e.preventDefault();
    if (pId.length !== 24) {
      return enqueueSnackbar('Please enter a valid product id', {
        variant: 'error',
      });
    }
    dispatch(fetchProductReviews(pId));
  }

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
            ? review.reviewMessage.subString(10) + '...'
            : review.reviewMessage,
      });
    });

  const columns = [
    {
      field: 'id',
      headerName: 'Review ID',
      minWidth: 200,
      flex: 1,
    },

    {
      field: 'User',
      headerName: 'User',
      minWidth: 100,
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
      flex: 0.3,
      headerName: 'Actions',
      minWidth: 120,
      type: 'text',
      sortable: false,
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-between flex-1 px-2 text-gray-500">
            <Button onClick={() => deleteHandler(params.row.id)}>
              <DeleteOutlineIcon />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 xl:px-20">
        {loading ? (
          <Loading />
        ) : (
          <div>
            <PageTitle title="Reviews" />
            <div className="flex-1">
              <form className="flex my-10 items-center px-10 justify-center flex-1 md:w-[900px] w-full mx-auto">
                <TextField
                  sx={{
                    mr: 2,
                  }}
                  size="small"
                  label="Product id"
                  value={pId}
                  onChange={(e) => setPId(e.target.value)}
                  onClick={(e) => e.target.select()}
                />

                <Button
                  type="submit"
                  onClick={handleSubmit}
                  variant="contained"
                  color="primary"
                >
                  Search
                </Button>
              </form>
            </div>
            {reviews && reviews?.length > 0 && (
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                disableSelectionOnClick
                autoHeight
                getRowClassName={(params) =>
                  params.row.rating < 1 ? 'bg-red-400 bg-opacity-10' : ''
                }
              />
            )}
            {reviews.length === 0 && (
              <h1 className="text-2xl text-center text-gray-500">
                There are no reviews for the product yet
              </h1>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

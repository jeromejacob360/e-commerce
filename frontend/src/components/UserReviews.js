import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Loading from '../helper-components/Loading';
import { clearErrors, getUserReviews } from '../redux/actions/userActions';
import { Button, Rating } from '@mui/material';
import date from 'date-and-time';
import RatingDialog from '../helper-components/RatingDialog';
import { deleteReview } from '../redux/actions/productActions';

export default function UserReviews({ history }) {
  const [editReviewModalOpen, setEditReviewModalOpen] = useState(false);

  const reviewRef = useRef();

  const dispatch = useDispatch();
  const { format } = date;

  const { loading, error, reviews } = useSelector(
    (state) => state.usersReviews,
  );
  const {
    loading: updateLoading,
    error: updateError,
    success,
  } = useSelector((state) => state.newReview);
  const {
    loading: deleteLoading,
    error: deleteError,
    success: deleteSuccess,
    message,
  } = useSelector((state) => state.reviews);

  useEffect(() => {
    dispatch(getUserReviews());
  }, [dispatch, success, deleteSuccess]);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      dispatch(clearErrors());
    }
    if (updateError) {
      enqueueSnackbar(updateError, { variant: 'error' });
      dispatch(clearErrors());
    }
    if (deleteError) {
      enqueueSnackbar(deleteError, { variant: 'error' });
      dispatch(clearErrors());
    }
    if (success) {
      enqueueSnackbar('Review updated', { variant: 'success' });
      dispatch({ type: 'CLEAR_NEW_REVIEW' });
    }
    if (deleteSuccess) {
      enqueueSnackbar(message, { variant: 'success' });
      dispatch({ type: 'CLEAR_NEW_REVIEW' });
    }
  }, [
    deleteError,
    deleteSuccess,
    dispatch,
    enqueueSnackbar,
    error,
    message,
    success,
    updateError,
  ]);

  if (loading || updateLoading || deleteLoading) return <Loading />;

  return (
    <>
      {reviews?.length > 0 ? (
        reviews.map((review) => {
          return (
            <div
              className="flex items-center justify-between p-4 m-4 border rounded-md xl:mx-40 md:mx-20"
              key={review.reviewId}
            >
              <img
                className="object-contain w-20 mr-4 h-28"
                src={review.image}
                alt=""
              />
              <div className="flex-1 space-y-2 text-gray-500">
                <h4>{review.productName}</h4>
                <p className="text-sm">{review.productDescription}</p>
                <Rating value={review.rating} precision={0.5} readOnly />
                <p className="text-black">
                  {review.reviewMessage.length > 100
                    ? review?.reviewMessage?.substring(0, 100) + '...'
                    : review?.reviewMessage}
                </p>
                <p>{format(new Date(review.createdAt), 'MMM DD YYYY')}</p>
                <div className="flex space-x-4">
                  <Button
                    onClick={() => {
                      reviewRef.current = review;
                      setEditReviewModalOpen(true);
                    }}
                    variant="outlined"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      dispatch(deleteReview(review.productId, review.reviewId));
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="space-y-6 text-xl text-center text-gray-600">
          <h4>No reviews found</h4>
          <Button variant="outlined" onClick={() => history.go(-1)}>
            Go Back
          </Button>
        </div>
      )}
      {editReviewModalOpen && (
        <RatingDialog
          existingReview={reviewRef.current}
          open={editReviewModalOpen}
          setOpen={setEditReviewModalOpen}
          productId={reviewRef.current.productId}
        />
      )}
    </>
  );
}

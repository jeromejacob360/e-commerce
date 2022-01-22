import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Rating } from '@mui/material';
import RatingDialog from './RatingDialog';
import {
  clearProductErrors,
  deleteReview,
} from '../redux/actions/productActions';
import { useSnackbar } from 'notistack';
import Loading from './Loading';

export default function ScrollDialog({ review, open = false, setOpen }) {
  const [ownReview, setOwnReview] = React.useState(false);
  const [editReview, setEditReview] = React.useState(false);

  const { product } = useSelector((state) => state.productDetails);
  const { user } = useSelector((state) => state.user);
  const { loading, error, success, message } = useSelector(
    (state) => state.reviews,
  );
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (review?.userId === user?._id) {
      setOwnReview(true);
    }
  }, [review?.userId, user?._id]);

  React.useEffect(() => {
    if (error) {
      enqueueSnackbar(error, {
        variant: 'error',
      });
      dispatch(clearProductErrors());
    }
    if (success) {
      enqueueSnackbar(message, {
        variant: 'success',
      });
      setOpen(false);
      dispatch(clearProductErrors());
    }
  }, [dispatch, enqueueSnackbar, error, message, setOpen, success]);

  function editClick() {
    setEditReview(true);
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    dispatch(deleteReview(product._id, review._id));
  };
  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose} scroll={'paper'}>
        <DialogTitle>
          <div className="flex flex-col items-center justify-between px-20 mb-4 sm:flex-row">
            <Avatar
              src={review.avatar}
              sx={{
                width: '100px',
                height: '100px',
                color: '#e0e0e0',
              }}
            />
            <div className="flex flex-col items-center">
              <h6 className="capitalize">
                {ownReview ? (
                  <span className="text-green-600">Me</span>
                ) : (
                  review.name
                )}
              </h6>
              <Rating
                sx={{
                  margin: '0 100px',
                }}
                value={review.rating}
                precision={0.5}
                readOnly
              />
            </div>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText ref={descriptionElementRef} tabIndex={-1}>
            <span className="whitespace-pre-wrap">{review.reviewMessage}</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {ownReview && <Button onClick={editClick}>Edit</Button>}
          {ownReview && <Button onClick={handleDelete}>Delete</Button>}
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <RatingDialog
        productId={product._id}
        open={editReview}
        setOpen={setEditReview}
        existingReview={review}
      />
    </div>
  );
}

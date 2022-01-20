import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Rating } from '@mui/material';
import { addReview } from '../redux/actions/productActions';
import { useDispatch, useSelector } from 'react-redux';

export default function RatingDialog({
  open = false,
  setOpen,
  productId,
  existingReview = { rating: 5, reviewMessage: '' },
}) {
  const [rating, setRating] = React.useState(existingReview.rating);
  const [review, setReview] = React.useState(existingReview.reviewMessage);

  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOpen(false);
    dispatch(addReview(productId, rating, review, user?.avatar?.url));
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Submit a review</DialogTitle>
        <DialogContent>
          <Rating
            defaultValue={4}
            precision={0.5}
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
          <div>
            <TextField
              multiline
              autoFocus
              margin="dense"
              id="name"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              type="text"
              fullWidth
              variant="standard"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

import { Avatar, Rating } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ScrollDialog from './ScrollDialog';

export default function ReviewCard({ review }) {
  const [ownReview, setOwnReview] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (review?.userId === user?._id) {
      setOwnReview(true);
    }
  }, [review?.userId, user?._id]);

  return (
    <>
      <div
        onClick={() => setReviewDialogOpen(true)}
        className="relative flex flex-col items-center w-[350px] px-4 py-2 mb-4 space-y-4 bg-gray-100 border rounded-lg shadow-md cursor-pointer"
      >
        <Avatar
          src={review.avatar}
          sx={{
            width: '40px',
            height: '40px',
            color: '#e0e0e0',
          }}
        />
        <h6 className="capitalize">
          {ownReview ? <span className="text-green-600">Me</span> : review.name}
        </h6>
        <Rating
          sx={{
            margin: '0 100px',
          }}
          value={review.rating}
          precision={0.5}
          readOnly
        />
        {/*  TODO view full review */}
        <div
          onClick={() => setReviewDialogOpen(true)}
          className="cursor-pointer"
        >
          {review?.reviewMessage?.length > 200
            ? review.reviewMessage.substring(0, 200) + '...'
            : review.reviewMessage}
        </div>
      </div>

      <ScrollDialog
        review={review}
        open={reviewDialogOpen}
        setOpen={setReviewDialogOpen}
      />
    </>
  );
}

import { Rating } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function ReviewCard({ review }) {
  return (
    <div
      className="bg-gray-100 space-y-4 flex items-center flex-col border rounded-lg shadow-md mx-2 mb-4 px-4 py-2 max-w-sm"
      style={{
        width: '200px !important',
      }}
    >
      <AccountCircleIcon
        sx={{
          width: '80px',
          height: '80px',
          color: '#e0e0e0',
        }}
      />
      <h6 className="capitalize">{review.name}</h6>
      <Rating
        sx={{
          margin: '0 100px',
        }}
        value={review.rating}
        precision={0.5}
        readOnly
      />
      {/*  TODO view full review */}
      <div>
        {review?.reviewMessage?.length > 200
          ? review.reviewMessage.substring(0, 200) + '...'
          : review.reviewMessage}
      </div>
    </div>
  );
}

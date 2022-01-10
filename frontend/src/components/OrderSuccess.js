import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function OrderSuccess() {
  return (
    <div className="flex flex-col items-center mt-20 space-y-4 text-2xl">
      <CheckCircleIcon
        sx={{
          color: 'green',
          fontSize: '48px',
        }}
      />
      <h1>Order Successfull</h1>
      <Button variant="contained" component={Link} to="/products">
        Continue Shopping
      </Button>
    </div>
  );
}

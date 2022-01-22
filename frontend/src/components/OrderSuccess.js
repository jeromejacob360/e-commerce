import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Button } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateOrder } from '../redux/actions/orderActions';

export default function OrderSuccess() {
  const dispatch = useDispatch();

  const { order } = useSelector((state) => state.newOrder);

  useEffect(() => {
    if (order) dispatch(updateOrder(order._id, order));
  }, [dispatch, order]);

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

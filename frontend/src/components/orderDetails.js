import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, getOrderDetails } from '../redux/actions/orderActions';
import { useSnackbar } from 'notistack';
import Loading from '../helper-components/Loading';
import Metadata from '../helper-components/metadata';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

export default function OrderDetails({ match, history }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { loading, order, error } = useSelector((state) => state.orderDetails);

  useEffect(() => {
    dispatch(getOrderDetails(match.params.id));
  }, [dispatch, match.params.id]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, {
        variant: 'error',
      });
      dispatch(clearErrors());
    }
  }, [enqueueSnackbar, dispatch, error]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div
      className={`max-w-screen-md mx-auto my-4 ${
        order ? 'border-b' : ''
      } sm:px-4 px:0`}
    >
      <div className="flex justify-center">
        <h1 className="pb-2 my-4 text-4xl border-b px-14">Order details</h1>
      </div>
      <Metadata title="Order Details" />
      {order ? (
        <div>
          <div>
            <h4>Order id: {order?._id}</h4>
            <div>
              <div className="flex flex-col mt-3 text-xl">
                <div className="flex my-2">
                  <h4>Payment status:&nbsp; </h4>
                  <p
                    className={
                      order?.paymentInfo?.status === 'succeeded'
                        ? 'text-green-700'
                        : 'text-red-700'
                    }
                  >
                    {order?.paymentInfo?.status === 'succeeded'
                      ? 'PAID'
                      : 'NOT PAID'}
                  </p>
                  <span className="text-base text-gray-600 normal-case">
                    {order?.paymentInfo?.status === 'succeeded' && (
                      <span>
                        &nbsp;on{' '}
                        {new Date(order.paidAt).toLocaleString().toString()}
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex">
                  <h4>Order status:&nbsp; </h4>
                  <p
                    className={`uppercase ${
                      order?.orderStatus && order?.orderStatus === 'Delivered'
                        ? 'text-green-700'
                        : 'text-red-700'
                    }`}
                  >
                    {`${order?.orderStatus}`}
                    <span className="text-base text-gray-600 normal-case">
                      {order?.orderStatus === 'Delivered' && (
                        <span>
                          {' '}
                          on{' '}
                          {new Date(order.deliveredAt)
                            .toLocaleString()
                            .toString()}
                        </span>
                      )}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <h4 className="my-4 text-xl ">Shipping Info</h4>
            <div className="mb-6 ml-8 space-y-2">
              <div className="flex">
                <p>Name:</p>
                <span>{order?.shippingInfo && order?.shippingInfo?.name}</span>
              </div>
              <div className="flex">
                <p>Phone:</p>
                <span>
                  {order?.shippingInfo && order?.shippingInfo?.mobile}
                </span>
              </div>
              <div className="flex">
                <p>Address:&nbsp;</p>
                <span>
                  {order?.shippingInfo &&
                    `${order?.shippingInfo?.area}, ${order?.shippingInfo?.city}, ${order?.shippingInfo?.district}, ${order?.shippingInfo?.state}, ${order?.shippingInfo?.pinCode}, ${order?.shippingInfo?.state}`}
                </span>
              </div>
            </div>
          </div>

          <div className="py-2 mt-2">
            <h4 className="my-4 text-xl">Order Items:</h4>
            <div className="mb-4 border rounded-md">
              {order?.orderItems &&
                order?.orderItems.map((item) => (
                  <div
                    className="flex items-center justify-between px-4 my-2"
                    key={item?._id}
                  >
                    <img
                      className="object-cover h-40 w-28"
                      src={item?.image}
                      alt="Product"
                    />
                    <Link to={`/product/${item?.product}`}>{item?.name}</Link>{' '}
                    <span>
                      {item?.quantity} X ₹{item?.price} ={' '}
                      <span>₹{item?.price * item?.quantity}</span>
                    </span>
                  </div>
                ))}
            </div>
            <div className="flex justify-between pl-10 pr-4">
              <h6>Cart Total:</h6>
              <span>₹{order?.itemsPrice}</span>
            </div>
            <div className="flex justify-between pl-10 pr-4">
              <h6>Discount:</h6>
              <span>₹{order?.discount}</span>
            </div>
            <div className="flex justify-between pl-10 pr-4">
              <h6>Shipping charges:</h6>
              <span>₹{order?.shippingPrice}</span>
            </div>
            <div className="flex justify-between pl-10 pr-4 mt-4 text-xl">
              <h6>Total:</h6>
              <span>₹{order?.totalPrice}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mb-10">
          <h2 className="my-10 text-center">UNAUTHORISED!</h2>
          <Button onClick={() => history.go(-1)} variant="contained">
            Go back
          </Button>
        </div>
      )}
    </div>
  );
}

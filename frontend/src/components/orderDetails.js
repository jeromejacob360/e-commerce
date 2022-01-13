import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, getOrderDetails } from '../redux/actions/orderActions';
import { useSnackbar } from 'notistack';
import Loading from '../helper-components/loading/Loading';
import Metadata from '../helper-components/metadata';
import { Link } from 'react-router-dom';

export default function OrderDetails({ match }) {
  const dispatch = useDispatch();
  const enqueueSnackbar = useSnackbar();
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
    <div className="sm:px-4 px:0 max-w-screen-md mx-auto border-b my-4">
      <div className="flex justify-center">
        <h1 className="text-4xl border-b px-14 pb-2 my-4">Order details</h1>
      </div>
      <Metadata title="Order Details" />
      <div className="orderDetailsPage">
        <div className="orderDetailsContainer">
          <h4>Order number: {order && order._id}</h4>
          <div>
            <div className="flex items-center text-xl  mt-3 space-x-2">
              <h4>Status:&nbsp; </h4>
              <p
                className={
                  order.paymentInfo && order.paymentInfo.status === 'succeeded'
                    ? 'text-green-700'
                    : 'text-red-700'
                }
              >
                {order.paymentInfo && order.paymentInfo.status === 'succeeded'
                  ? 'PAID,'
                  : 'NOT PAID,'}
              </p>
              <p
                className={`uppercase ${
                  order.orderStatus && order.orderStatus === 'Delivered'
                    ? 'text-green-700'
                    : 'text-red-700'
                }`}
              >
                {order.orderStatus && order.orderStatus}
              </p>
            </div>
          </div>

          <h4 className="text-xl my-4 ">Shipping Info</h4>
          <div className="ml-8 space-y-2 mb-6">
            <div className="flex">
              <p>Name:</p>
              <span>{order.shippingInfo && order.shippingInfo.name}</span>
            </div>
            <div className="flex">
              <p>Phone:</p>
              <span>{order.shippingInfo && order.shippingInfo.mobile}</span>
            </div>
            <div className="flex">
              <p>Address:&nbsp;</p>
              <span>
                {order.shippingInfo &&
                  `${order.shippingInfo.area}, ${order.shippingInfo.city}, ${order.shippingInfo.district}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.state}`}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-2 py-2">
          <h4 className="text-xl my-4">Order Items:</h4>
          <div className="border rounded-md mb-4">
            {order.orderItems &&
              order.orderItems.map((item) => (
                <div
                  className="flex items-center justify-between px-4 my-2"
                  key={item.product}
                >
                  <img
                    className="w-28 h-40 object-cover"
                    src={item.image}
                    alt="Product"
                  />
                  <Link to={`/product/${item.product}`}>{item.name}</Link>{' '}
                  <span>
                    {item.quantity} X ₹{item.price} ={' '}
                    <span>₹{item.price * item.quantity}</span>
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
            <span>₹{order.shippingPrice}</span>
          </div>
          <div className="flex justify-between pl-10 pr-4 text-xl mt-4">
            <h6>Total:</h6>
            <span>₹{order.totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

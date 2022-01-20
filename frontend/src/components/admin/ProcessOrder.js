import { useDispatch, useSelector } from 'react-redux';
import { Button, InputAdornment, MenuItem, Select } from '@mui/material';
import PageTitle from '../../helper-components/PageTitle';
import CategoryIcon from '@mui/icons-material/Category';
import { useEffect, useState } from 'react';
import { getOrderDetails, updateOrder } from '../../redux/actions/orderActions';
import { useSnackbar } from 'notistack';
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom';

export default function ProcessOrder({ match }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [status, setStatus] = useState('');

  const { user } = useSelector((state) => state.user);
  const { order } = useSelector((state) => state.orderDetails);
  const { isUpdated } = useSelector((state) => state.order);

  const shippingInfo = user.shippingInfo || {};

  useEffect(() => {
    dispatch(getOrderDetails(match.params.id));
    if (isUpdated) {
      enqueueSnackbar('Order status updated', { variant: 'success' });
      dispatch({
        type: 'UPDATE_ORDER_RESET',
      });
    }
  }, [dispatch, match.params.id, isUpdated, enqueueSnackbar]);

  useEffect(() => {
    if (order?.orderStatus) {
      setStatus(order.orderStatus);
    }
  }, [order?.orderStatus]);

  function updateStatus() {
    const updatedOrder = { ...order, orderStatus: status };
    dispatch(updateOrder(order._id, updatedOrder));
  }

  const address = `${shippingInfo.area}, ${shippingInfo.street}, ${shippingInfo.city}, ${shippingInfo.district}, ${shippingInfo.state}`;

  return (
    <div className="flex flex-col md:flex-row">
      <PageTitle title="Process order" />
      <div className="flex-1 xl:px-20">
        <div>
          <Sidebar />
          <div className="flex flex-col md:flex-row ">
            {order && (
              <div className="xl:px-40 sm:px-10 px-4 mt-10 flex-1 md:grid md:grid-cols-[2fr_1fr]">
                <div className="md:mr-10 SHIPPING">
                  <div className="px-4 ADDRESS">
                    <h3 className="px-10 pb-2 mb-4 text-xl text-center border-b">
                      Shipping Address
                    </h3>
                    <div className="mb-10">
                      <div>
                        <span>Name:&nbsp;</span>
                        <span>{shippingInfo.name}</span>
                      </div>
                      <div>
                        <span>Phone:&nbsp;</span>
                        <span>{shippingInfo.mobile}</span>
                      </div>
                      <div>
                        <span>Address:&nbsp;</span>
                        <span>{address}</span>
                      </div>
                      <div>
                        <span>PIN:&nbsp;</span>
                        <span>{shippingInfo.pinCode}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div>
                      <div className="flex flex-col mt-3 text-xl">
                        <div className="flex my-2">
                          <h4>Payment status:&nbsp; </h4>
                          <p
                            className={
                              order.paymentInfo &&
                              order.paymentInfo.status === 'succeeded'
                                ? 'text-green-700'
                                : 'text-red-700'
                            }
                          >
                            {order.paymentInfo &&
                            order.paymentInfo.status === 'succeeded'
                              ? 'PAID,'
                              : 'NOT PAID,'}
                          </p>
                        </div>
                        <div className="flex">
                          <h4>Order status:&nbsp; </h4>
                          <p
                            className={`uppercase ${
                              order.orderStatus &&
                              order.orderStatus === 'Delivered'
                                ? 'text-green-700'
                                : 'text-red-700'
                            }`}
                          >
                            {order.orderStatus && order.orderStatus}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="CART">
                      <h4 className="pb-2 my-10 text-xl text-center border-b">
                        Order Items
                      </h4>
                      {order?.orderItems?.map((item) => {
                        return (
                          <div
                            key={item.productId}
                            className="flex items-center justify-between mb-4"
                          >
                            <Link to={`/product/${item.productId}`}>
                              <img
                                src={item.image}
                                className="object-cover w-20 mr-2 h-28"
                                alt=""
                              />
                            </Link>
                            <span>{item.name}</span>
                            <div className="space-x-2">
                              <span>{item.quantity}</span>
                              <span>x</span>
                              <span>₹{item.price}</span>
                              <span>=</span>
                              <span className="text-base">
                                ₹{item.price * item.quantity}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      <div className="py-3 text-right border-t border-b">
                        Total:&nbsp;₹{order.itemsPrice}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-10 sm:px-10 PAYMENT">
                  <h4 className="pb-2 mb-4 text-xl text-center border-b">
                    Order Summary
                  </h4>
                  <div className="flex justify-between mb-2 px-14">
                    <span>Cart Total:&nbsp;</span>
                    <span>₹{order.itemsPrice}</span>
                  </div>
                  <div className="flex justify-between mb-2 px-14">
                    <span>Shipping:&nbsp;</span>
                    <span>₹{order.shippingPrice}</span>
                  </div>
                  <div className="flex justify-between mb-2 px-14">
                    <span>Discount:&nbsp;</span>
                    <span>₹{order.discount}</span>
                  </div>
                  <div className="flex justify-between py-2 text-lg font-semibold border-t border-b px-14">
                    <span>Total:&nbsp;</span>
                    <span>₹{order.totalPrice}</span>
                  </div>
                  {order.orderStatus !== 'Delivered' && (
                    <div className="flex flex-col items-center">
                      <Select
                        value={status}
                        onChange={(e) => setStatus(e.target.value.toString())}
                        sx={{ my: 10, width: '300px' }}
                        name="category"
                        displayEmpty
                        renderValue={() => <div>{status}</div>}
                        startAdornment={
                          <InputAdornment position="start">
                            <CategoryIcon />
                          </InputAdornment>
                        }
                      >
                        {order.orderStatus === 'Processing' && (
                          <MenuItem value="Shipped">Shipped</MenuItem>
                        )}
                        {order.orderStatus === 'Shipped' && (
                          <MenuItem value="Delivered">Delivered</MenuItem>
                        )}
                      </Select>

                      <Button
                        onClick={updateStatus}
                        fullWidth
                        sx={{
                          mt: 3,
                        }}
                        variant="contained"
                      >
                        Update
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

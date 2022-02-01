import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  cancelOrder,
  cancelReturn,
  clearErrors,
  getOrderDetails,
  returnOrder,
} from '../redux/actions/orderActions';
import { useSnackbar } from 'notistack';
import Metadata from '../helper-components/Metadata';
import { Link } from 'react-router-dom';
import date from 'date-and-time';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  TextField,
} from '@mui/material';
import { motion } from 'framer-motion';
import Loading from '../helper-components/Loading';

export default function OrderDetails({ match, history }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { loading, order, error } = useSelector((state) => state.orderDetails);

  const [cancelDialog, setCancelDialog] = useState(false);
  const [returnDialog, setReturnDialog] = useState(false);

  const isRendered = useRef(false);

  const [reason, setReason] = useState('');

  const {
    success,
    error: cancelError,
    message,
  } = useSelector((state) => state.cancelOrder);

  const returnProductId = useRef(null);

  const { format } = date;
  useEffect(() => {
    isRendered.current = true;

    dispatch(getOrderDetails(match.params.id));
  }, [dispatch, match.params.id, success]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, {
        variant: 'error',
      });
      dispatch(clearErrors());
    }
    if (cancelError) {
      enqueueSnackbar(cancelError, {
        variant: 'error',
      });
    }
    if (success) {
      enqueueSnackbar(message, {
        variant: 'success',
      });
    }
  }, [enqueueSnackbar, dispatch, error, cancelError, success, message]);

  function cancelOrderHandler() {
    dispatch(cancelOrder(returnProductId.current, order._id, reason));
  }

  function returnOrderHandler() {
    dispatch(returnOrder(returnProductId.current, order._id, reason));
  }

  function cancelReturnHandler() {
    dispatch(cancelReturn(returnProductId.current, order._id));
  }

  if (loading && order._id !== match.params.id) return <Loading />;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        layout={isRendered.current}
        className={`max-w-screen-md mx-auto my-4 ${
          order ? 'border-b' : ''
        } sm:px-4 px-4`}
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
                  <div className="flex flex-col my-2">
                    <div className="flex">
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
                    </div>
                    <span className="text-base text-gray-600 normal-case">
                      {order?.paymentInfo?.status === 'succeeded' && (
                        <span>
                          &nbsp;on{' '}
                          {format(
                            new Date(order.paidAt),
                            'MMM DD YYYY hh:MM:SS A',
                          )}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="">
                    <div className="flex">
                      <h4>Order status:&nbsp; </h4>
                      <p
                        className={`uppercase ${
                          order?.orderStatus &&
                          order?.orderStatus === 'Delivered'
                            ? 'text-green-700'
                            : 'text-red-700'
                        }`}
                      >
                        {`${order?.orderStatus}`}
                      </p>
                    </div>
                    <span className="text-base text-gray-600 normal-case">
                      {order?.orderStatus === 'Delivered' && (
                        <span>
                          {' '}
                          on{' '}
                          {format(
                            new Date(order.deliveredAt),
                            'MMM DD YYYY hh:MM:SS A',
                          )}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <h4 className="my-4 text-xl ">Shipping Info</h4>
              <div className="mb-6 ml-8 space-y-2">
                <div className="flex">
                  <p>Name:</p>
                  <span>
                    {order?.shippingInfo && order?.shippingInfo?.name}
                  </span>
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
              <div className="mb-4 rounded-md">
                {order?.orderItems &&
                  order?.orderItems.map((item) => (
                    <div
                      key={item?._id}
                      className={`mb-4 border py-4 ${
                        item.status === 'Cancelled' ||
                        item.status === 'Returned'
                          ? 'bg-gray-100 opacity-50'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between px-4 my-2">
                        <Link to={`/product/${item?.productId}`}>
                          <img
                            className="object-contain h-40 w-28"
                            src={item?.image}
                            alt="Product"
                          />
                        </Link>

                        <div className="flex flex-col items-end justify-between space-y-4">
                          <span>
                            {item?.quantity} X ₹{item?.price} ={' '}
                            <span>₹{item?.price * item?.quantity}</span>
                          </span>
                          <span className="uppercase">{item?.status}</span>

                          {(item?.status === 'Processing' ||
                            item?.status === 'Shipped') && (
                            <Button
                              disabled={loading}
                              onClick={() => {
                                setCancelDialog(true);
                                setReason('');
                                returnProductId.current =
                                  item?.productId.toString();
                              }}
                              color="primary"
                            >
                              Cancel item
                            </Button>
                          )}
                          {item?.status === 'Delivered' && (
                            <Button
                              disabled={loading}
                              onClick={() => {
                                setReturnDialog(true);
                                setReason('');
                                returnProductId.current =
                                  item?.productId.toString();
                              }}
                              color="primary"
                            >
                              Return item
                            </Button>
                          )}
                          {item?.status === 'Return requested' && (
                            <Button
                              disabled={loading}
                              onClick={() => {
                                returnProductId.current =
                                  item?.productId.toString();
                                cancelReturnHandler();
                              }}
                              color="primary"
                            >
                              Cancel return
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="px-4 space-y-2">
                        <div>{item?.name}</div>
                        <div>{item?.description}</div>
                        {item?.reason && (
                          <div>
                            <span>Reason:</span>
                            <div>{item?.reason}</div>
                          </div>
                        )}
                      </div>
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
            {/* CANCEL DIALOG */}

            <Dialog
              open={cancelDialog}
              onClose={() => {
                setCancelDialog(false);
              }}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Cancel Order</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Would you mind telling us why you are cancelling this?
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Reason"
                  type="text"
                  value={reason}
                  fullWidth
                  onChange={(e) => {
                    setReason(e.target.value);
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setCancelDialog(false)} color="primary">
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setCancelDialog(false);
                    cancelOrderHandler();
                  }}
                  color="primary"
                >
                  Proceed
                </Button>
              </DialogActions>
            </Dialog>

            {/* RETURN DIALOG */}

            <Dialog
              open={returnDialog}
              onClose={() => {
                setReturnDialog(false);
              }}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Return Order</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Would you mind telling us why you are returnling this?
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Reason"
                  type="text"
                  value={reason}
                  fullWidth
                  onChange={(e) => {
                    setReason(e.target.value);
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setReturnDialog(false)} color="primary">
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setReturnDialog(false);
                    returnOrderHandler();
                  }}
                  color="primary"
                >
                  Proceed
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mb-10">
            <h2 className="my-10 text-center">UNAUTHORISED!</h2>
            <Button onClick={() => history.go(-1)} variant="contained">
              Go back
            </Button>
          </div>
        )}
      </motion.div>
      {loading && (
        <div className="fixed bottom-10 right-10">
          <Fab color="secondary" aria-label="add">
            <CircularProgress value={80} />
          </Fab>
        </div>
      )}
    </>
  );
}

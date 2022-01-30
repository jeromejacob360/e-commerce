import { Button, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Steps from '../helper-components/Steps';
import Metadata from '../helper-components/Metadata';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EventIcon from '@mui/icons-material/Event';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Loading from '../helper-components/Loading';
import { useSnackbar } from 'notistack';
import { createOrder } from '../redux/actions/orderActions';
import { clearCart } from '../redux/actions/cartActions';

export default function Payment({ history }) {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
  const [stripeApiKey, setStripeApiKey] = useState('');
  const [disablePayBtn, setDisablePayBtn] = useState(true);
  const [validated, setValidated] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
  });

  const { user } = useSelector((state) => state.user);
  const { cartItems: cartItemWithImageObj } = useSelector(
    (state) => state.cart,
  );
  const { enqueueSnackbar } = useSnackbar();

  // convert image object to string
  const cartItems = cartItemWithImageObj?.map((item) => ({
    ...item,
    image: item.image.url,
  }));

  const order = {
    shippingInfo: user.shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.cartTotal,
    discount: orderInfo.discount,
    shippingPrice: orderInfo.shipping,
    totalPrice: orderInfo.total,
  };

  useEffect(() => {
    getStripeApiKey();
  }, []);

  useEffect(() => {
    if (validated.cardNumber && validated.cardExpiry && validated.cardCvc) {
      setDisablePayBtn(false);
    } else {
      setDisablePayBtn(true);
    }
  }, [validated]);

  const paymentData = {
    amount: orderInfo.total * 100,
  };

  const verifyComplete = ({ error, complete }) => {
    if (complete) {
      return true;
    } else {
      if (error?.error?.message) {
        setDisablePayBtn(true);
        enqueueSnackbar(error.error.message, { variant: 'error' });
      } else {
        setDisablePayBtn(true);
      }
    }
  };

  function validateCardNumber(error, complete) {
    if (verifyComplete(error, complete)) {
      setValidated({
        ...validated,
        cardNumber: true,
      });
    }
  }
  function validatecardExpiry(error, complete) {
    if (verifyComplete(error, complete)) {
      setValidated({
        ...validated,
        cardExpiry: true,
      });
    }
  }
  function validatecardCvc(error, complete) {
    if (verifyComplete(error, complete)) {
      setValidated({
        ...validated,
        cardCvc: true,
      });
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (disablePayBtn) return;
    setDisablePayBtn(true);

    try {
      const { data } = await axios.post('/api/payment/process', paymentData);

      const clientSecret = data.clientSecret;

      if (!stripe || !elements) {
        console.log('Stripe or elements are not loaded.');
        setDisablePayBtn(false);
        return;
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
            address: {
              line1: user.shippingInfo.area,
              city: user.shippingInfo.city,
              state: user.shippingInfo.state,
              postal_code: user.shippingInfo.pinCode,
              country: 'in',
            },
          },
        },
      });

      if (result.error) {
        setDisablePayBtn(false);
        enqueueSnackbar(result.error.message, {
          variant: 'error',
        });
        return;
      }

      if (result.paymentIntent.status === 'succeeded') {
        order.paymentInfo = {
          id: result.paymentIntent.id,
          status: result.paymentIntent.status,
        };

        dispatch(createOrder(order));
        dispatch({
          type: 'CLEAR_CART',
        });
        dispatch(clearCart());

        setDisablePayBtn(false);
        history.push('/success');
      } else {
        setDisablePayBtn(false);
        enqueueSnackbar('Something went wrong. Please try again.', {
          variant: 'error',
        });
      }
    } catch (error) {
      setDisablePayBtn(false);
    }
  }

  async function getStripeApiKey() {
    const { data } = await axios.get('/api/stripeApiKey');
    const { stripeApiKey } = data;
    setStripeApiKey(stripeApiKey);
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    enqueueSnackbar('Copied to clipboard', {
      variant: 'success',
      autoHideDuration: 1000,
    });
  }

  if (!stripeApiKey) {
    return <Loading />;
  }

  return (
    <>
      <Metadata title="Payment" />
      <Steps activeStep={2} />
      <div>
        <h1 className="pb-2 mx-auto mt-20 mb-8 text-2xl font-semibold text-center border-b w-60">
          Card Info
        </h1>

        <form
          className="grid space-y-8 place-items-center"
          onSubmit={handleSubmit}
        >
          <div className="relative flex items-center w-80">
            <CreditCardIcon className="absolute left-2" />
            <CardNumberElement
              onChange={validateCardNumber}
              className="w-full pt-3 pb-2 pl-10 pr-2 border rounded-md "
            />
          </div>
          <div className="flex space-x-4 w-80">
            <div className="relative flex items-center w-full">
              <EventIcon className="absolute left-2" />
              <CardExpiryElement
                onChange={validatecardExpiry}
                className="w-full pt-3 pb-2 pl-10 pr-4 border rounded-md"
              />
            </div>
            <div className="relative flex items-center w-full">
              <VpnKeyIcon className="absolute left-2" />
              <CardCvcElement
                onChange={validatecardCvc}
                className="w-full pt-3 pb-2 pl-10 pr-2 border rounded-md"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="contained"
            sx={{
              width: '320px',
            }}
            disabled={disablePayBtn}
          >{`Pay - ₹${orderInfo && orderInfo.total}`}</Button>
        </form>
      </div>
      <p className="w-full px-10 mt-20 sm:text-center">
        Psst.. Its in test mode.
        <br /> Use{' '}
        <Tooltip title="Copy to clipboard">
          <span
            onClick={() => {
              copyToClipboard(4242424242424242);
            }}
            className="text-lg text-orange-600 cursor-pointer"
          >
            4242424242424242
          </span>
        </Tooltip>{' '}
        for card number,{' '}
        <Tooltip title="Copy to clipboard">
          <span
            onClick={() => {
              copyToClipboard(555);
            }}
            className="text-orange-600 cursor-pointer"
          >
            any future date
          </span>
        </Tooltip>{' '}
        for expiry and{' '}
        <Tooltip title="Copy to clipboard">
          <span
            onClick={() => {
              copyToClipboard(999);
            }}
            className="text-orange-600 cursor-pointer"
          >
            any number
          </span>
        </Tooltip>{' '}
        for CVC
      </p>
    </>
  );
}

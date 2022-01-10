import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Steps from '../helper-components/Steps';
import Metadata from '../metadata';
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
import { useSelector } from 'react-redux';
import axios from 'axios';
import Loading from '../helper-components/loading/Loading';
import { useSnackbar } from 'notistack';

export default function Payment() {
  const stripe = useStripe();
  const elements = useElements();
  const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
  const [stripeApiKey, setStripeApiKey] = useState();
  const [disablePayBtn, setDisablePayBtn] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getStripeApiKey();
  }, []);

  const paymentData = {
    amount: orderInfo.total * 100,
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setDisablePayBtn(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post(
        '/api/v1/payment/process',
        paymentData,
        config,
      );

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
          autoHideDuration: 5000,
        });
        return;
      }

      if (result.paymentIntent.status === 'succeeded') {
        window.location.href = '/order-success';
      } else {
        setDisablePayBtn(false);
        enqueueSnackbar('Something went wrong. Please try again.', {
          variant: 'error',
          autoHideDuration: 5000,
        });
      }
    } catch (error) {
      console.log(error.message);

      setDisablePayBtn(false);
    }
  }

  async function getStripeApiKey() {
    const { data } = await axios.get('/api/v1/stripeApiKey');
    const { stripeApiKey } = data;
    setStripeApiKey(stripeApiKey);
  }

  if (!stripeApiKey) {
    return <Loading />;
  }

  return (
    <div>
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
            <CardNumberElement className="w-full pt-3 pb-2 pl-10 pr-2 border rounded-md" />
          </div>
          <div className="flex space-x-4 w-80">
            <div className="relative flex items-center w-full">
              <EventIcon className="absolute left-2" />
              <CardExpiryElement className="w-full pt-3 pb-2 pl-10 pr-4 border rounded-md" />
            </div>
            <div className="relative flex items-center w-full">
              <VpnKeyIcon className="absolute left-2" />
              <CardCvcElement className="w-full pt-3 pb-2 pl-10 pr-2 border rounded-md" />
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
    </div>
  );
}

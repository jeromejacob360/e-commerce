import { Button, FormGroup, OutlinedInput } from '@mui/material';
import { useEffect, useState } from 'react';
import Metadata from '../helper-components/Metadata';
import Steps from '../helper-components/Steps';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingInfo } from '../redux/actions/userActions';

export default function Checkout({ history }) {
  const { enqueueSnackbar } = useSnackbar();

  const { shippingInfoloading, error, user } = useSelector(
    (state) => state.user,
  );
  const shippingInfo = user.shippingInfo || {};

  const [address, setAddress] = useState(shippingInfo);
  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
    }
  }, [error, enqueueSnackbar]);

  const dispatch = useDispatch();

  function setValue(e) {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (
      !address.name ||
      !address.area ||
      !address.street ||
      !address.city ||
      !address.district ||
      !address.state ||
      !address.pinCode ||
      !address.mobile
    ) {
      enqueueSnackbar('Please fill all the fields', {
        variant: 'error',
      });
    } else if (address.mobile.length !== 10) {
      enqueueSnackbar('Phone number should be 10 digits long', {
        variant: 'error',
      });
    } else if (address.pinCode.length !== 6) {
      enqueueSnackbar('Please enter valid pin code', {
        variant: 'error',
      });
    } else {
      dispatch(saveShippingInfo(address));
      history.push('/checkout/confirm');
    }
  }
  return (
    <div className="mb-10">
      <Metadata title="Shipping Details" />
      <Steps activeStep={0} />
      <div className="flex flex-col items-center justify-center w-screen mt-8">
        <h1 className="px-10 pb-2 mb-4 text-xl border-b">Shipping Details</h1>
        <form>
          <FormGroup margin="dense" size="small" className="space-y-4 w-80">
            <OutlinedInput
              type="text"
              placeholder="Mobile number"
              name="mobile"
              autoComplete="off"
              value={address.mobile}
              onChange={setValue}
            />
            <OutlinedInput
              type="text"
              placeholder="Name"
              autoComplete="off"
              name="name"
              value={address.name}
              onChange={setValue}
            />
            <OutlinedInput
              type="text"
              placeholder="Area"
              name="area"
              autoComplete="off"
              value={address.area}
              onChange={setValue}
            />
            <OutlinedInput
              type="text"
              placeholder="Street"
              name="street"
              autoComplete="off"
              value={address.street}
              onChange={setValue}
            />
            <OutlinedInput
              type="text"
              placeholder="City"
              name="city"
              autoComplete="off"
              value={address.city}
              onChange={setValue}
            />
            <OutlinedInput
              type="text"
              placeholder="District"
              name="district"
              autoComplete="off"
              value={address.district}
              onChange={setValue}
            />

            <OutlinedInput
              type="number"
              placeholder="PIN"
              name="pinCode"
              autoComplete="off"
              value={address.pinCode}
              onChange={setValue}
            />
            <OutlinedInput
              type="text"
              placeholder="State"
              name="state"
              autoComplete="off"
              value={address.state}
              onChange={setValue}
            />
            <Button
              type="submit"
              onClick={handleSubmit}
              fullWidth
              variant="contained"
              color="primary"
              disabled={shippingInfoloading}
            >
              Continue
            </Button>
          </FormGroup>
        </form>
      </div>
    </div>
  );
}

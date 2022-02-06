import {
  Button,
  FormGroup,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import Metadata from '../helper-components/Metadata';
import Steps from '../helper-components/Steps';
import { InputVerifier, InputTick } from '../helper-components/InputVerifier';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingInfo } from '../redux/actions/userActions';
import { getStates } from 'country-state-picker';

const initialState = {
  name: '',
  area: '',
  street: '',
  city: '',
  district: '',
  state: '',
  pinCode: '',
  mobile: '',
};

export default function Checkout({ history }) {
  const states = getStates('in');
  const { enqueueSnackbar } = useSnackbar();

  const { shippingInfoloading, error, user } = useSelector(
    (state) => state.user,
  );

  const isRendered = useRef(false);
  const [address, setAddress] = useState(user.shippingInfo || initialState);

  useEffect(() => {
    isRendered.current = true;
  }, []);

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
      <div className="flex flex-col items-center justify-center w-full mt-8">
        <h1 className="px-10 pb-2 mb-4 text-2xl border-b">Shipping Details</h1>
        <form>
          <FormGroup margin="dense" size="small" className="space-y-4 w-80">
            <div className="relative flex items-center">
              <OutlinedInput
                fullWidth
                type="tel"
                placeholder="Mobile number"
                name="mobile"
                autoComplete="off"
                value={address.mobile}
                onChange={(e) => {
                  const mobile = e.target.value;
                  const digit = mobile[mobile.length - 1];

                  if ((digit >= 0 && digit <= 9) || !digit) {
                    if (mobile.length > 10) {
                      setAddress({ ...address, mobile: mobile.slice(0, 10) });
                    } else setAddress({ ...address, mobile });
                  }
                }}
              />
              {isRendered.current && (
                <InputVerifier
                  condition1={
                    address?.mobile?.length === 10 || !address?.mobile
                  }
                  condition2={address?.mobile?.length === 10}
                  length={address?.mobile?.length}
                />
              )}
            </div>
            <div className="relative flex items-center">
              <OutlinedInput
                fullWidth
                type="text"
                placeholder="Name"
                autoComplete="off"
                name="name"
                value={address.name}
                onChange={setValue}
              />
              {isRendered.current && (
                <InputTick condition={address.name.length > 3} />
              )}
            </div>
            <div className="relative flex items-center">
              <OutlinedInput
                fullWidth
                type="text"
                placeholder="Area"
                name="area"
                autoComplete="off"
                value={address.area}
                onChange={setValue}
              />
              {isRendered.current && (
                <InputTick condition={address.area.length > 3} />
              )}
            </div>
            <div className="relative flex items-center">
              <OutlinedInput
                fullWidth
                type="text"
                placeholder="Street"
                name="street"
                autoComplete="off"
                value={address.street}
                onChange={setValue}
              />
              {isRendered.current && (
                <InputTick condition={address.street.length > 3} />
              )}
            </div>
            <div className="relative flex items-center">
              <OutlinedInput
                fullWidth
                type="text"
                placeholder="City"
                name="city"
                autoComplete="off"
                value={address.city}
                onChange={setValue}
              />
              {isRendered.current && (
                <InputTick condition={address.city.length > 3} />
              )}
            </div>
            <div className="relative flex items-center">
              <OutlinedInput
                fullWidth
                type="text"
                placeholder="District"
                name="district"
                autoComplete="off"
                value={address.district}
                onChange={setValue}
              />
              {isRendered.current && (
                <InputTick condition={address.district.length > 3} />
              )}
            </div>

            <div className="relative flex items-center">
              <OutlinedInput
                type="tel"
                fullWidth
                placeholder="PIN"
                name="pinCode"
                autoComplete="off"
                value={address.pinCode}
                onChange={(e) => {
                  const pinCode = e.target.value;
                  const digit = pinCode[pinCode.length - 1];

                  if ((digit >= 0 && digit <= 9) || !digit) {
                    if (pinCode.length > 6) {
                      setAddress({ ...address, pinCode: pinCode.slice(0, 6) });
                    } else setAddress({ ...address, pinCode });
                  } else return;
                }}
              />
              {isRendered.current && (
                <InputVerifier
                  condition1={address.pinCode?.length === 6 || !address.pinCode}
                  condition2={address.pinCode?.length === 6}
                  length={address.pinCode?.length}
                  reqLength={6}
                />
              )}
            </div>
            <Select
              name="state"
              displayEmpty
              renderValue={(value) =>
                value ? value : <div className="text-gray-400">State</div>
              }
              value={address.state}
              onChange={setValue}
            >
              {states.map((state) => (
                <MenuItem className="capitalize" key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </Select>
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

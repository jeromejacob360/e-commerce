import { Button, Input } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Metadata from '../helper-components/Metadata';
import { forgotPassword } from '../redux/actions/userActions';
import { useSnackbar } from 'notistack';
import Loading from '../helper-components/Loading';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { error, success, loading, message } = useSelector(
    (state) => state.forgotPassword,
  );

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      dispatch({ type: 'CLEAR_ERRORS' });
    }
    if (success) {
      enqueueSnackbar(message, { variant: 'success' });
    }
  });

  const forgotPasswordSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  if (loading) return <Loading />;
  return (
    <div className="items-center w-screen h-screen mt-40">
      <Metadata title="Forgot Password" />
      <div className="flex flex-col items-center">
        <h2 className="mb-12 text-3xl text-gray-600">Forgot Password</h2>

        <form className="flex items-center space-x-4">
          <Input
            type="email"
            placeholder="Email"
            required
            autoFocus
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button type="submit" onClick={forgotPasswordSubmit}>
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}

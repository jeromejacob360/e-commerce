import { Button, Input } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Metadata from '../helper-components/Metadata';
import { resetPassword } from '../redux/actions/userActions';
import { useSnackbar } from 'notistack';
import Loading from '../helper-components/Loading';

export default function ResetPassword({ match, history }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
      history.push('/login');
    }
  }, [error, success, message, dispatch, history, enqueueSnackbar]);

  const resetPasswordSubmit = (e) => {
    e.preventDefault();
    dispatch(resetPassword(password, confirmPassword, match.params.token));
  };

  if (loading) return <Loading />;
  return (
    <div className="items-center w-screen h-screen mt-40">
      <Metadata title="Reset Password" />
      <div className="flex flex-col items-center">
        <h2 className="mb-12 text-3xl text-gray-600">Reset Password</h2>

        <form className="flex flex-col items-center space-y-10">
          <Input
            type="password"
            placeholder="New password"
            required
            autoFocus
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirm password"
            required
            autoFocus
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            fullWidth
            variant="outlined"
            type="submit"
            onClick={resetPasswordSubmit}
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}

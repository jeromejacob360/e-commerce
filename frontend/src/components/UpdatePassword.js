import {
  Button,
  FormGroup,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import React, { useEffect, useState } from 'react';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { useSnackbar } from 'notistack';
import { Box } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../helper-components/Loading';
import { changePassword } from '../redux/actions/userActions';

export default function UpdatePassword({ history }) {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector(
    (state) => state.forgotPassword,
  );

  useEffect(() => {
    if (error) {
      let editedError = error;
      if (error.includes('validation failed')) {
        editedError = error.split(':')[2];
      }

      enqueueSnackbar(editedError, { variant: 'error' });
      dispatch({ type: 'CLEAR_ERRORS' });
    }
    if (success) {
      enqueueSnackbar('Password changed', { variant: 'success' });
      dispatch({ type: 'CLEAR_PROFILE_STATE' });
      history.push('/account');
    }
  }, [dispatch, error, success, history, enqueueSnackbar]);

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(changePassword({ oldPassword, newPassword, confirmPassword }));
  }

  if (loading) return <Loading />;

  return (
    <Box className="flex justify-center mt-40">
      <Paper className="px-4 py-8" elevation={2} px={2} pb={3}>
        <h1 className="pl-1 text-2xl text-gray-500 capitalize">
          Change password
        </h1>
        <form>
          <FormGroup
            margin="dense"
            size="small"
            className="pt-10 space-y-8 w-80"
          >
            <OutlinedInput
              name="oldPassword"
              type={showOldPassword ? 'text' : 'password'}
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    edge="end"
                  >
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />

            <OutlinedInput
              name="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />

            <OutlinedInput
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />

            <Button
              type="submit"
              onClick={handleSubmit}
              fullWidth
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          </FormGroup>
        </form>
      </Paper>
    </Box>
  );
}

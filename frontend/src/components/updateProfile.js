import { Box, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SignupForm from '../helper-components/SignupForm';
import { updateProfile, loadUser } from '../redux/actions/userActions';
import { useSnackbar } from 'notistack';
import Loading from '../helper-components/Loading';

export default function UpdateProfile({ history }) {
  const { user: loggedInUser } = useSelector((state) => state.user);
  const { loading, success, error } = useSelector((state) => state.profile);
  const [user, setUser] = useState({
    email: '',
    name: '',
    avatar: '',
  });

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  useEffect(() => {
    if (loggedInUser) {
      let { email, name, avatar = '' } = loggedInUser;
      avatar = avatar.url;
      setUser({
        email,
        name,
        avatar,
      });
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      dispatch({ type: 'CLEAR_ERRORS' });
    }
    if (success) {
      enqueueSnackbar('Profile updated', { variant: 'success' });

      dispatch(loadUser());
      dispatch({ type: 'CLEAR_PROFILE_STATE' });
      history.push('/account');
    }
  }, [dispatch, error, success, history, enqueueSnackbar]);

  function handleUpdate(e) {
    e.preventDefault();
    dispatch(updateProfile(user));
  }

  if (loading) return <Loading />;

  return (
    <Box className="flex justify-center pt-10 mt-40">
      <Paper elevation={2} sx={{ p: 2 }}>
        <Box px={2} pb={3}>
          <SignupForm
            handleSubmit={handleUpdate}
            user={user}
            setUser={setUser}
            buttonText="Update"
            passwordField={false}
          />
          ;
        </Box>
      </Paper>
    </Box>
  );
}

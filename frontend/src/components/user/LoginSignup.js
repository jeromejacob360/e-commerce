import { Box, Button, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material';
import Login from '../../helper-components/Login';
import Signup from '../../helper-components/Signup';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Loading from '../../helper-components/loading/Loading';

export default function LoginSignup({ history }) {
  const theme = useTheme();

  const [mode, setMode] = useState('login');

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user,
  );

  useEffect(() => {
    const action = () => (
      <Button
        onClick={() => {
          closeSnackbar();
        }}
      >
        Close
      </Button>
    );

    if (error) {
      enqueueSnackbar(error, {
        variant: 'error',
        autoHideDuration: 3000,
        action,
      });
    }
  }, [error, enqueueSnackbar, closeSnackbar]);

  const redirect = window.location.search
    ? window.location.search.split('=')[1]
    : '/';

  useEffect(() => {
    if (isAuthenticated) {
      history.push(redirect);
    }
  }, [isAuthenticated, history, redirect]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Box className="flex justify-center mt-20">
      <Paper elevation={2}>
        <Box px={2} pb={3}>
          <Box className="flex justify-between mt-2 mb-8">
            <Button
              onClick={() => setMode('login')}
              sx={{
                borderBottom:
                  mode === 'login' && `4px solid ${theme.palette.primary.main}`,
                flex: 1,
                borderRadius: 0,
              }}
            >
              Login
            </Button>
            <Button
              onClick={() => setMode('signup')}
              sx={{
                borderBottom:
                  mode === 'signup' &&
                  `4px solid ${theme.palette.primary.main}`,
                flex: 1,
                borderRadius: 0,
              }}
            >
              Signup
            </Button>
          </Box>
          {mode === 'login' ? <Login /> : <Signup />}
        </Box>
      </Paper>
    </Box>
  );
}

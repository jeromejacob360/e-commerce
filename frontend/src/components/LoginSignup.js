import { Box, Button, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material';
import Login from '../helper-components/Login';
import Signup from '../helper-components/Signup';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Loading from '../helper-components/Loading';
import { useHistory } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

export default function LoginSignup() {
  const theme = useTheme();
  const history = useHistory();

  const [mode, setMode] = useState('login');

  const { enqueueSnackbar } = useSnackbar();

  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user,
  );

  useEffect(() => {
    if (error) {
      let editedError = error;
      if (error.includes('validation failed')) {
        editedError = error.split(':')[2];
      }
      enqueueSnackbar(editedError, {
        variant: 'error',
      });
    }
  }, [error, enqueueSnackbar]);

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
    <Box className="flex justify-center mt-20 sm:mt-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
      >
        <Paper elevation={2}>
          <Box px={2} pb={3}>
            <Box className="flex justify-between mt-2 mb-8">
              <Button
                onClick={() => setMode('login')}
                sx={{
                  borderBottom:
                    mode === 'login' &&
                    `4px solid ${theme.palette.primary.main}`,
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
            <AnimatePresence exitBeforeEnter>
              {mode === 'login' ? (
                <motion.div layoutId="loginSignup">
                  <Login />
                </motion.div>
              ) : (
                <motion.div layoutId="loginSignup">
                  <Signup />
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}

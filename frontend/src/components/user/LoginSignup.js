import { Box, Button, Paper } from '@mui/material';
import React, { useState } from 'react';
import { useTheme } from '@mui/material';
import Login from '../../helper-components/Login';
import Signup from '../../helper-components/Signup';

export default function LoginSignup() {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');

  return (
    <Box className="flex justify-center mt-40">
      <Paper elevation={8}>
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
          {mode === 'login' ? (
            <Login
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
            />
          ) : (
            <Signup
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              name={name}
              setName={setName}
            />
          )}
        </Box>
      </Paper>
    </Box>
  );
}

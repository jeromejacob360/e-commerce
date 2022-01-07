import { Box, Paper } from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SignupForm from '../helper-components/SignupForm';

export default function UpdateProfile() {
  const { user: loggedInUser } = useSelector((state) => state.user);
  const [user, setUser] = useState(loggedInUser);

  function handleUpdate(e) {
    e.preventDefault();
    console.log('handleUpdate', user);
  }

  return (
    <Box className="flex justify-center mt-20">
      <Paper elevation={2} sx={{ p: 2 }}>
        <Box px={2} pb={3}>
          <SignupForm
            handleSubmit={handleUpdate}
            user={user}
            setUser={setUser}
            buttonText="Update"
          />
          ;
        </Box>
      </Paper>
    </Box>
  );
}

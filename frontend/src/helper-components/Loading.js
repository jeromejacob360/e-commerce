import React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

export default function Loading() {
  return (
    <Backdrop
      sx={{
        top: '68.5px',
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

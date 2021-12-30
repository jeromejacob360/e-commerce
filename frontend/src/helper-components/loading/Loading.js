import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box } from '@mui/material';
import './loading.css';

export default function Loading() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <RefreshIcon
        sx={{
          fontSize: '100px',
          color: '#aeaeae',
          animation: 'spin 1s linear infinite',
        }}
      />
    </Box>
  );
}

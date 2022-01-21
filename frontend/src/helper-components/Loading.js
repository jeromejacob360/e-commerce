import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box } from '@mui/material';

export default function Loading() {
  return (
    <Box
      sx={{
        width: '100vw',
        height: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div className="animate-spin">
        <RefreshIcon
          sx={{
            fontSize: '100px',
            color: '#aeaeae',
            animation: 'spin 1s linear infinite',
          }}
        />
      </div>
    </Box>
  );
}

import { CircularProgress, Fab } from '@mui/material';
import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="fixed bottom-10 right-10">
      <Fab color="secondary" aria-label="add">
        <CircularProgress value={80} />
      </Fab>
    </div>
  );
}

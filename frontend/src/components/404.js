import { Button } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

export default function FourOFour({ history }) {
  return (
    <div className="grid w-full mt-20 place-items-center">
      <h1 className="text-4xl text-yellow-600">404</h1>
      <p className="my-4">Page not found</p>
      <div className="flex space-x-4">
        <Button variant="outlined" component={Link} to="/">
          Go home
        </Button>
        <Button variant="outlined" onClick={() => history.goBack()}>
          Go back
        </Button>
      </div>
    </div>
  );
}

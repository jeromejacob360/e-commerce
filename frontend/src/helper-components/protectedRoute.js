import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import Loading from './loading/Loading';

export default function ProtectedRoute({ component: Component, ...rest }) {
  const { isAuthenticated, loading } = useSelector((state) => state.user);

  if (loading) {
    console.log('loading');
    return <Loading />;
  }

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticated) {
          console.log('not authenticated');
          return <Redirect to="/login" />;
        }
        console.log('authenticated');
        return <Component {...props} />;
      }}
    />
  );
}

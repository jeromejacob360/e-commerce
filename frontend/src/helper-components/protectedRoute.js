import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import Loading from './loading/Loading';

export default function ProtectedRoute({ component: Component, ...rest }) {
  console.log('ProtectedRoute');
  const { isAuthenticated, loading } = useSelector((state) => state.user);

  console.log(`isAuthenticated`, isAuthenticated);

  if (loading) {
    console.log('loading');
    return <Loading />;
  }

  if (isAuthenticated === false) {
    console.log('not authenticated');
    return <Redirect to="/login" />;
  } else {
    console.log('authenticated');
    return <Route {...rest} component={Component} />;
  }
}

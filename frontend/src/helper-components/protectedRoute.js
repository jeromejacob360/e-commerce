import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import Loading from './loading/Loading';

export default function ProtectedRoute({ component: Component, ...rest }) {
  const { isAuthenticated, loading } = useSelector((state) => state.user);

  console.log(`isAuthenticated`, isAuthenticated);

  if (loading) {
    return <Loading />;
  }

  if (isAuthenticated === true) {
    return <Route {...rest} component={Component} />;
  } else if (isAuthenticated === null || isAuthenticated === undefined) {
    return null;
  } else {
    return <Redirect to="/login" />;
  }
}

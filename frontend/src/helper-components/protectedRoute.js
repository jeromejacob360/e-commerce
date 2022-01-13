import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import Loading from './loading/Loading';

export default function ProtectedRoute({ component: Component, ...rest }) {
  const { isAuthenticated, loading } = useSelector((state) => state.user);

  if (loading) {
    return <Loading />;
  }

  if (isAuthenticated === false) {
    return <Redirect to="/login" />;
  } else {
    return <Route {...rest} component={Component} />;
  }
}

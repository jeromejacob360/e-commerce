import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

export default function AdminRoute({ component: Component, ...rest }) {
  const { user } = useSelector((state) => state.user);

  if (user.role !== 'admin') {
    return <Redirect to="/login" />;
  } else {
    return <Route {...rest} component={Component} />;
  }
}

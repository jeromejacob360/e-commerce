import React, { useState } from 'react';

import { register } from '../redux/actions/userActions';
import { useDispatch } from 'react-redux';
import SignupForm from './SignupForm';

export default function Signup() {
  const [user, setUser] = useState({
    email: '',
    password: '',
    name: '',
    avatar: '',
  });

  const dispatch = useDispatch();

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(register(user));
  }

  return (
    <SignupForm handleSubmit={handleSubmit} user={user} setUser={setUser} />
  );
}

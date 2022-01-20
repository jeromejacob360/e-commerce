import { Avatar, Button, Paper } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Account() {
  const { user } = useSelector((state) => state.user);
  return (
    <div className="flex flex-col items-center justify-center w-full mt-20">
      <Paper
        elevation={0}
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div className="flex flex-col items-start space-y-3">
          <Avatar
            src={user?.avatar?.url}
            alt={user.name}
            sx={{
              width: '70px',
              height: '70px',
            }}
          />
          <h1 className="font-bold capitalize">{user.name}</h1>
          <p>
            <span className="text-gray-500">Email: </span>
            {user.email}
          </p>
          <p>
            <span className="text-gray-500">Joined on: </span>
            {user.createdAt.toString().substring(0, 10)}
          </p>
        </div>
      </Paper>
      <Link to="/me/update">
        {/* <Button variant="contained"> Edit profile</Button>  */}
        {/* //TODO add edit profile button< */}
      </Link>

      <div className="flex justify-center w-full mt-4 space-x-6">
        <Button component={Link} to="/orders/me" variant="outlined">
          My Orders
        </Button>
        {/* <Button variant="outlined">Change password</Button> */}
      </div>
    </div>
  );
}

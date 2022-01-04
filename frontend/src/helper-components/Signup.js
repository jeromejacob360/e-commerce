import {
  Button,
  FormControl,
  Input,
  InputAdornment,
  OutlinedInput,
} from '@mui/material';
import React from 'react';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import LockIcon from '@mui/icons-material/Lock';

export default function Login({
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
}) {
  return (
    <FormControl className="space-y-8" margin="dense" size="small">
      <OutlinedInput
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        startAdornment={
          <InputAdornment position="start">
            <PermIdentityIcon />
          </InputAdornment>
        }
        aria-describedby="outlined-weight-helper-text"
        inputProps={{
          'aria-label': 'weight',
        }}
      />
      <OutlinedInput
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        startAdornment={
          <InputAdornment position="start">
            <MailOutlineIcon />
          </InputAdornment>
        }
        aria-describedby="outlined-weight-helper-text"
        inputProps={{
          'aria-label': 'weight',
        }}
      />

      <OutlinedInput
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        startAdornment={
          <InputAdornment position="start">
            <LockIcon />
          </InputAdornment>
        }
        aria-describedby="outlined-weight-helper-text"
        inputProps={{
          'aria-label': 'weight',
        }}
      />
      <label htmlFor="contained-button-file">
        <Input
          sx={{
            display: 'none',
          }}
          accept="image/*"
          id="contained-button-file"
          multiple
          type="file"
        />
        <Button
          startIcon={<AccountCircleIcon />}
          fullWidth
          variant="outlined"
          component="span"
        >
          Choose image
        </Button>
      </label>
      <Button fullWidth variant="contained" color="primary">
        Sign up
      </Button>
    </FormControl>
  );
}

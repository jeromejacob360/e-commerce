import {
  Button,
  FormControl,
  InputAdornment,
  Link,
  OutlinedInput,
} from '@mui/material';
import React from 'react';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockIcon from '@mui/icons-material/Lock';

export default function Login({ email, setEmail, password, setPassword }) {
  return (
    <FormControl className="space-y-8" margin="dense" size="small">
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
      <Link href="#">Forgot password</Link>
      <Button fullWidth variant="contained" color="primary">
        Log in
      </Button>
    </FormControl>
  );
}

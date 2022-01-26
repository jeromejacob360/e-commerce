import {
  Button,
  FormGroup,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockIcon from '@mui/icons-material/Lock';
import { login } from '../redux/actions/userActions';
import { useDispatch } from 'react-redux';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPw, setShowPw] = useState(false);

  function handleLogin(e) {
    e.preventDefault();
    dispatch(login(email, password));
  }
  return (
    <form>
      <FormGroup margin="dense" size="small" className="space-y-8 w-80">
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
          type={showPw ? 'text' : 'password'}
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <LockIcon />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPw(!showPw)}
                edge="end"
              >
                {showPw ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        <Link className="text-orange-600" to="/password/forgot">
          Forgot password?
        </Link>
        <Button
          type="submit"
          onClick={handleLogin}
          fullWidth
          variant="contained"
          color="primary"
        >
          Log in
        </Button>
      </FormGroup>
    </form>
  );
}

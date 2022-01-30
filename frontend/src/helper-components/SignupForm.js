import { useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  FormGroup,
  IconButton,
  Input,
  InputAdornment,
  OutlinedInput,
} from '@mui/material';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import LockIcon from '@mui/icons-material/Lock';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useState } from 'react';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { motion } from 'framer-motion';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { InputVerifier } from './InputVerifier';

export default function SignupForm({
  user,
  setUser,
  handleSubmit,
  buttonText = 'Signup',
  passwordField = true,
}) {
  const [showPw, setShowPw] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  function setValue(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    const isVerified = !!String(user.email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
    if (isVerified) {
      setEmailVerified(true);
    } else {
      setEmailVerified(false);
    }
  }, [user.email]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setUser({ ...user, avatar: reader.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <FormGroup margin="dense" size="small" className="pt-10 space-y-8 w-80">
        <OutlinedInput
          type="text"
          placeholder="Name"
          autoComplete="off"
          name="name"
          value={user.name}
          onChange={setValue}
          startAdornment={
            <InputAdornment position="start">
              <PermIdentityIcon />
            </InputAdornment>
          }
        />
        <div className="relative flex items-center">
          <OutlinedInput
            fullWidth
            type="email"
            placeholder="Email"
            name="email"
            autoComplete="off"
            value={user.email}
            onChange={setValue}
            startAdornment={
              <InputAdornment position="start">
                <MailOutlineIcon />
              </InputAdornment>
            }
          />
          {emailVerified && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: { duration: 0.5 },
              }}
              exit={{ opacity: 0, x: -10 }}
              className={`text-green-600 absolute right-2`}
            >
              <CheckCircleOutlineIcon />
            </motion.div>
          )}
        </div>

        {passwordField && (
          <div className="relative flex items-center">
            <OutlinedInput
              fullWidth
              name="password"
              type={showPw ? 'text' : 'password'}
              placeholder="password"
              value={user.password}
              onChange={setValue}
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
            <InputVerifier
              condition1={user.password.length >= 4 || !user.password.length}
              condition2={user.password.length >= 4}
              length={user.password.length}
              endOffset={'right-10'}
              reqLength={4}
            />
          </div>
        )}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
        >
          <Avatar
            sx={{ width: 56, height: 56 }}
            alt="Preview"
            src={user.avatar ? user.avatar : ''}
          />
          <label htmlFor="contained-button-file">
            <Input
              component="input"
              sx={{
                display: 'none',
              }}
              type="file"
              inputProps={{ accept: 'image/png, image/gif, image/jpeg' }}
              id="contained-button-file"
              onChange={handleImageChange}
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
        </Box>
        <Button
          type="submit"
          onClick={handleSubmit}
          fullWidth
          variant="contained"
          color="primary"
        >
          {buttonText}
        </Button>
      </FormGroup>
    </motion.form>
  );
}

import {
  Avatar,
  Box,
  Button,
  FormGroup,
  Input,
  InputAdornment,
  OutlinedInput,
} from '@mui/material';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import LockIcon from '@mui/icons-material/Lock';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function SignupForm({
  user,
  setUser,
  handleSubmit,
  buttonText = 'Signup',
}) {
  function setValue(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setUser({ ...user, avatar: reader.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <form>
      <FormGroup margin="dense" size="small" className="space-y-8 w-80">
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
        <OutlinedInput
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

        <OutlinedInput
          type="password"
          placeholder="password"
          name="password"
          value={user.password}
          onChange={setValue}
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
    </form>
  );
}

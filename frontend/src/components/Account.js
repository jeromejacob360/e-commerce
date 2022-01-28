import {
  Avatar,
  Button,
  ButtonGroup,
  InputAdornment,
  OutlinedInput,
  Paper,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

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
      <Link to="/me/update"></Link>

      <div className="flex flex-col items-center space-y-8">
        <ButtonGroup
          variant="outlined"
          aria-label="outlined primary button group"
        >
          <Button component={Link} to="/orders/me">
            My Orders
          </Button>
          <Button component={Link} to="/me/reviews">
            My Reviews
          </Button>
        </ButtonGroup>
        <ButtonGroup
          variant="outlined"
          aria-label="outlined primary button group"
        >
          <Button component={Link} to="/me/update">
            Update profile
          </Button>
          <Button component={Link} to="/password/update">
            Change password
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

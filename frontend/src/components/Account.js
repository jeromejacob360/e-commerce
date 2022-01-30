import { Avatar, Button, ButtonGroup } from '@mui/material';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Account() {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="flex flex-col items-center justify-center w-full mt-20">
      <motion.div
        initial={{ boxShadow: '0px 0px 0px 0px rgba(0,0,0,0.2)' }}
        animate={{ boxShadow: 'rgba(0,0,0,0.2) 1px 1px 10px 7px' }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center py-8 mx-6 border mb-14 rounded-3xl w-72"
      >
        <div className="flex flex-col items-start space-y-3">
          <Avatar
            src={user?.avatar?.url}
            alt={user.name}
            sx={{
              width: '100px',
              height: '100px',
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
      </motion.div>
      <Link to="/me/update"></Link>

      <div className="flex flex-col items-center space-y-8">
        <ButtonGroup
          fullWidth
          variant="contained"
          aria-label="contained primary button group"
        >
          <Button sx={{ color: 'white' }} component={Link} to="/orders/me">
            My Orders
          </Button>
          <Button sx={{ color: 'white' }} component={Link} to="/me/reviews">
            My Reviews
          </Button>
        </ButtonGroup>
        <ButtonGroup
          variant="contained"
          aria-label="contained primary button group"
        >
          <Button sx={{ color: 'white' }} component={Link} to="/me/update">
            Update profile
          </Button>
          <Button
            sx={{ color: 'white' }}
            component={Link}
            to="/password/update"
          >
            Change password
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

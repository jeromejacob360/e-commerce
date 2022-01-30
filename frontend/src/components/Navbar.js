import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { logoutUser } from '../redux/actions/userActions';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { Badge, ListItemIcon, TextField } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useSnackbar } from 'notistack';
import { setSearchQuery } from '../redux/actions/productActions';
import Logout from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [options, setOptions] = useState([]);
  const [searchText, setSearchText] = useState('');

  const { user, isAuthenticated, loading, logout } = useSelector(
    (state) => state.user,
  );
  const { cartItems } = useSelector((state) => state.cart);

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      enqueueSnackbar('Welcome ' + user?.name?.split(' ')[0], {
        variant: 'success',
      });
    }
    if (logout) {
      enqueueSnackbar('Logged out');
    }
  }, [enqueueSnackbar, history, isAuthenticated, loading, logout, user?.name]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(searchText));
    history.push(`/products?keyword=${searchText.trim()}`);
  };

  useEffect(() => {
    const menuOptions = [
      { name: 'My Orders', function: orders, icon: <LocalMallIcon /> },
      { name: 'Profile', function: account, icon: <AccountCircleIcon /> },
      { name: 'Logout', function: logout, icon: <Logout /> },
    ];

    if (isAuthenticated && user?.role === 'admin') {
      setOptions([
        { name: 'Dashboard', function: dashboard, icon: <DashboardIcon /> },
        ...menuOptions,
      ]);
    }

    if (isAuthenticated && user?.role === 'user') {
      setOptions(menuOptions);
    }

    if (!isAuthenticated) {
      setOptions([{ name: 'Login', function: login, icon: <LoginIcon /> }]);
    }
    function dashboard() {
      handleCloseUserMenu();
      history.push('/admin/dashboard');
    }
    function orders() {
      history.push('/orders/me');
    }
    function login() {
      history.push('/login?redirect=' + window.location.pathname);
    }

    function account() {
      history.push('/account');
    }

    async function logout() {
      dispatch(logoutUser());
    }
  }, [user, history, dispatch, isAuthenticated]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      sx={{
        marginBottom: '1rem',
        position: 'fixed',
        top: 0,
        zIndex: 100,
      }}
      position="static"
    >
      <Container maxWidth="xl">
        <Toolbar className="justify-between" disableGutters>
          <Link to="/">
            <h2 className="hidden mr-2 text-2xl text-white md:flex">
              THE SHOE STORE
            </h2>
          </Link>
          {/* FOR SMALL SCREENS */}
          <div className="flex items-center justify-between flex-1 md:hidden">
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              className="block md:hidden"
            >
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to={`/`}>
                  <Typography textAlign="center">Home</Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to={`/products`}>
                  <Typography textAlign="center">Collections</Typography>
                </Link>
              </MenuItem>
            </Menu>
            <form
              className="relative flex items-center flex-1 px-4 md:px-20 sm:px-10"
              onSubmit={handleSearch}
            >
              <TextField
                className="p-2 bg-white rounded-md"
                fullWidth
                placeholder="Search..."
                size="small"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
              />
              {searchText && (
                <span
                  onClick={() => setSearchText('')}
                  className="absolute right-6"
                >
                  <Link to="/products">
                    <HighlightOffIcon />
                  </Link>
                </span>
              )}
            </form>
          </div>

          {/* SEARCH PANEL IN LARGE SCREEN */}
          <div className="items-center justify-between flex-1 hidden px-10 space-x-4 md:flex">
            <Link to={`/products`}>
              <Typography sx={{ fontSize: '1.25rem' }} textAlign="center">
                Collections
              </Typography>
            </Link>
            <form
              className="relative flex items-center"
              onSubmit={handleSearch}
            >
              <TextField
                className="p-2 bg-white rounded-md"
                fullWidth
                placeholder="Search..."
                size="small"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
              />
              {searchText && (
                <span
                  onClick={() => setSearchText('')}
                  className="absolute right-2"
                >
                  <Link to="/products">
                    <HighlightOffIcon />
                  </Link>
                </span>
              )}
            </form>
          </div>
          <div className="flex items-center">
            {isAuthenticated && (
              <Tooltip title="Go to Cart">
                <Badge
                  component={Link}
                  to="/cart"
                  sx={{ mr: 3 }}
                  badgeContent={cartItems?.length}
                  color="error"
                >
                  <LocalMallIcon
                    sx={{
                      width: '2rem',
                      height: '2rem',
                    }}
                    color="secondary"
                  />
                </Badge>
              </Tooltip>
            )}
            <Tooltip title="Open options">
              <IconButton
                data-testid="avatarButton"
                onClick={handleOpenUserMenu}
                sx={{ p: 0 }}
              >
                <Avatar
                  alt={user?.name}
                  data-testid="userAvatar"
                  src={user?.avatar?.url}
                />
              </IconButton>
            </Tooltip>

            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {options.map((option) => (
                <MenuItem
                  key={option.name}
                  onClick={() => {
                    handleCloseUserMenu();
                    option.function();
                  }}
                >
                  <ListItemIcon>{option.icon}</ListItemIcon>
                  <h2>{option.name}</h2>
                </MenuItem>
              ))}
            </Menu>
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;

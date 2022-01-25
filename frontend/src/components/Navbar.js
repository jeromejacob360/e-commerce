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
import { Badge, TextField } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { setSearchQuery } from '../redux/actions/productActions';

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [options, setOptions] = useState([]);
  const [searchText, setSearchText] = useState('');

  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const history = useHistory();

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(searchText));
    history.push(`/products?keyword=${searchText.trim()}`);
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      setOptions([
        { name: 'Dashboard', function: dashboard },
        { name: 'Orders', function: orders },
        { name: 'Account', function: account },
        { name: 'Logout', function: logout },
      ]);
    }

    if (isAuthenticated && user?.role === 'user') {
      setOptions([
        { name: 'Orders', function: orders },
        { name: 'Account', function: account },
        { name: 'Logout', function: logout },
      ]);
    }

    if (!isAuthenticated) {
      setOptions([{ name: 'Login', function: login }]);
    }
    function dashboard() {
      handleCloseUserMenu();
      history.push('/admin/dashboard');
    }
    function orders() {
      history.push('/orders/me');
    }
    function login() {
      history.push('/login');
    }

    function account() {
      history.push('/account');
    }

    async function logout() {
      dispatch(logoutUser());
      history.push('/logout');
      // window.location.href = '/login';
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
                placeholder="Search......"
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
                placeholder="Search......"
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

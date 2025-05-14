import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Logo from '../../Assets/logo.png';
import { Link } from 'react-router-dom';
import '../../Styles/Nav.css';

function Nav() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [loginAnchorEl, setLoginAnchorEl] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLoginMenuOpen = (event) => {
    setLoginAnchorEl(event.currentTarget);
  };

  const handleLoginMenuClose = () => {
    setLoginAnchorEl(null);
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'white', color: 'black', boxShadow: 1 }}>
      <Container maxWidth="xl" sx={{ px: 2, maxWidth: '1200px' }}>
        <Toolbar disableGutters sx={{ minHeight: { xs: 60, md: 80 }, px: 0, width: '100%' }}>
          <Box
            component="img"
            src={Logo}
            alt="Logo"
            sx={{
              height: { xs: 30, md: 50 },
              mr: 2,
              transition: 'transform 0.3s ease',
              display: { xs: 'none', md: 'flex' }
            }}
          />

          <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 2 }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: 'black' }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              display: { xs: 'flex', md: 'none' },
              mr: 2,
              flexGrow: 1,
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 700,
              letterSpacing: { xs: '0.05rem', md: '0.1rem' },
              textDecoration: 'none',
              color: '#d32f2f',
              fontSize: { xs: '1rem', md: '1.25rem' },
            }}
          >
            LIFE FLOW
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'center' }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Button onClick={handleCloseNavMenu} className='nav-options'>
                Home
              </Button>
            </Link>
            <Link to='/about'>
              <Button onClick={handleCloseNavMenu} className='nav-options'>
                About Us
              </Button>
            </Link>
            <Link to='/ContactUs'>
              <Button onClick={handleCloseNavMenu} className='nav-options'>
                Contact
              </Button>
            </Link>


            <div>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#C24047',
                  color: 'white',
                  fontWeight: 600,
                  px: 2.5,
                  borderRadius: 1,
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#b71c1c' }
                }}
                onClick={handleLoginMenuOpen}
              >
                Login
              </Button>
              <Menu
                anchorEl={loginAnchorEl}
                open={Boolean(loginAnchorEl)}
                onClose={handleLoginMenuClose}
                MenuListProps={{ onMouseLeave: handleLoginMenuClose }}
                sx={{ mt: 1 }}
              >
                <MenuItem onClick={handleLoginMenuClose}>
                  <Link to="/login" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                    Donor Login
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleLoginMenuClose}>
                  <Link to="/UserLogin" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                    User Login
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleLoginMenuClose}>
                  <Link to="/hosLogin" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                    Hospital Login
                  </Link>
                </MenuItem>
              </Menu>
            </div>
          </Box>

          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            <MenuItem className='mobile-menu'>
              <Link to='/' style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                <Typography textAlign="center">Home</Typography>
              </Link>
            </MenuItem>
            <MenuItem className='mobile-menu'>
              <Link to='/about' style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                <Typography textAlign="center">About Us</Typography>
              </Link>
            </MenuItem>
            <MenuItem className='mobile-menu'>
              <Typography textAlign="center">Contact</Typography>
            </MenuItem>
            <MenuItem className='mobile-menu'>
              <Link to='/login' style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                <Typography textAlign="center">Donor Login</Typography>
              </Link>
            </MenuItem>
            <MenuItem className='mobile-menu'>
              <Link to='/UserLogin' style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                <Typography textAlign="center">User Login</Typography>
              </Link>
            </MenuItem>
            <MenuItem className='mobile-menu'>
              <Link to='/hosLogin' style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                <Typography textAlign="center">Hospital Login</Typography>
              </Link>
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Nav;
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

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
    <AppBar position="static" sx={{ backgroundColor: 'transparent' }}>
      <Box
        sx={{
          borderBottom: '1px solid #ccc', // Add a thin line at the bottom
          paddingBottom: '10px', // Add padding at the bottom for separation
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            width: '100%', // Set width to 100%
            paddingLeft: '16px', // Adjust left padding
            paddingRight: '16px', // Adjust right padding
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between', // Align items at the start and end
            borderBottom: '1px solid #ccc', // Add a thin line at the bottom
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AdbIcon sx={{ display: { xs: 'none', md: 'flex', color:'black'}, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 'bold', // Set to 'bold' for thick text
                letterSpacing: '.3rem',
                color: 'black', // Set to 'black' for dark color
                textDecoration: 'none',
              }}
            >
              LOGO
            </Typography>
          </Box>


          <Box>
            <Tooltip title="Open settings">
              <Button variant="outlined" sx={{ mr: 2, fontWeight: 'bold' }}>Source Code</Button>

              <IconButton sx={{ p: 0, mr: 2, color: 'black' }}>
                <NotificationsNoneIcon />
              </IconButton>
              <Button
                onClick={handleOpenUserMenu}
                sx={{ p: 0, paddingRight: '16px' }}
              >
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </Button>
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
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  );
}

export default ResponsiveAppBar;

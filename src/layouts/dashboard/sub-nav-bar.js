import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

const pages = [
  { label: 'Home', icon: <HomeOutlinedIcon /> },
  { label: 'Gallery', icon: <CollectionsOutlinedIcon /> },
  { label: 'Settings', icon: <SettingsOutlinedIcon /> },
];

function ResponsiveSubAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [activePage, setActivePage] = React.useState(pages[0].label);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handlePageClick = (label) => {
    setActivePage(label);
    handleCloseNavMenu();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
      <Toolbar
        disableGutters
        sx={{
          paddingLeft: '32px',
          paddingRight: '32px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          letterSpacing: '.3rem',
          color: 'black',
          textDecoration: 'none',
        }}
      >
        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
            sx={{
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 'bold',
              letterSpacing: '.3rem',
              color: 'black',
              textDecoration: 'none',
            }}
          >
            {pages.map((page) => (
              <MenuItem
                key={page.label}
                onClick={() => handlePageClick(page.label)}
                sx={{
                  backgroundColor: activePage === page.label ? '#2196f3' : 'transparent',
                }}
              >
                {page.icon}
                <Typography
                  component="div"
                  textAlign="center"
                  sx={{
                    marginLeft: '12px',
                    marginRight: '12px',
                    padding: '16px',
                    borderBottom: activePage === page.label ? '2px solid #2196f3' : 'none',
                    color: activePage === page.label ? '#2196f3' : 'black',
                    textDecoration: 'none', // Remove underline
                  }}
                >
                  {page.label}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>

        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {pages.map((page, index) => (
            <Button
              key={page.label}
              onClick={() => handlePageClick(page.label)}
              sx={{
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 'bold',
                letterSpacing: '.3rem',
                color: activePage === page.label ? '#2196f3' : 'gray',
                textDecoration: 'none',
                marginX: index < pages.length - 1 ? '20px' : 0,
                borderBottom: activePage === page.label ? '2px solid #2196f3' : 'none',
                padding: '20px', // Adjust padding
                borderRadius: '8px', // Add border-radius for rounded corners
              }}
            >
              {page.icon}
              <Typography
                sx={{
                  marginLeft: '8px',
                  color: activePage === page.label ? '#2196f3' : 'gray',
                }}
              >
                {page.label}
              </Typography>
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default ResponsiveSubAppBar;

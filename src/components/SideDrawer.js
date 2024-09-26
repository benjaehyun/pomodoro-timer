import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Button,
  useTheme,
  useMediaQuery,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  List as ListIcon,
  AccountCircle as AccountCircleIcon,
  ExitToApp as LogoutIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { logout } from '../features/authSlice';
import Auth from './Auth';

const SideDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsOpen(open);
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
  };

  const drawerWidth = isMobile ? '80%' : '300px';

  const darkGrey = '#333333';

  const list = () => (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        flexDirection: 'column',
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" sx={{ color: darkGrey }}>
          Pomodoro Timer
        </Typography>
        <IconButton onClick={toggleDrawer(false)} sx={{ color: darkGrey }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1, width: '100%' }}>
        {[
          { text: 'Home', icon: <HomeIcon />, path: '/' },
          { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
          { text: 'Cycle Management', icon: <ListIcon />, path: '/cycles' },
        ].map((item) => (
          <ListItem 
            key={item.text} 
            component={RouterLink} 
            to={item.path}
            sx={{ 
              color: darkGrey,
              width: '100%',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <ListItemIcon sx={{ color: darkGrey, minWidth: '40px' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2, width: '100%' }}>
        {isLoggedIn ? (
          <>
            <ListItem 
              component={RouterLink} 
              to="/profile" 
              sx={{ 
                mb: 1, 
                color: darkGrey, 
                width: '100%',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ color: darkGrey, minWidth: '40px' }}><AccountCircleIcon /></ListItemIcon>
              <ListItemText primary={user.displayName} secondary="View Profile" />
            </ListItem>
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              fullWidth
              sx={{ 
                color: darkGrey, 
                borderColor: darkGrey,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button
            variant="outlined"
            onClick={() => { setAuthOpen(true); setIsOpen(false); }}
            fullWidth
            sx={{ 
              color: darkGrey, 
              borderColor: darkGrey,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            Login / Register
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <IconButton
        edge="start"
        aria-label="menu"
        onClick={toggleDrawer(true)}
        sx={{ position: 'absolute', top: 16, left: 16, color: darkGrey }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer 
        anchor="left" 
        open={isOpen} 
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: drawerWidth,
            backgroundColor: 'transparent',
            boxShadow: 'none',
          }
        }}
      >
        {list()}
      </Drawer>
      <Auth open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default SideDrawer;
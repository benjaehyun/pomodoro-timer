import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Button, Box } from '@mui/material';
import { logout } from '../features/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Profile
      </Typography>
      <Typography variant="body1">
        Username: {user.username}
      </Typography>
      <Typography variant="body1">
        Display Name: {user.displayName}
      </Typography>
      <Typography variant="body1">
        Email: {user.email}
      </Typography>
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={handleLogout}
        sx={{ mt: 2 }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default Profile;
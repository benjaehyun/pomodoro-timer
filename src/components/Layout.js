import React from 'react';
import { Container, Box } from '@mui/material';
import SideDrawer from './SideDrawer';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <SideDrawer />
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          {children}
        </Box>
      </Container>
    </Box>
  );
};

export default Layout;
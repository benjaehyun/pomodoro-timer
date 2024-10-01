import React, { useState } from 'react';
import { Container, Box } from '@mui/material';
import SideDrawer from './SideDrawer';
import ConfigurationManager from './ConfigurationManager';

const Layout = ({ children }) => {
  const [configManagerOpen, setConfigManagerOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <SideDrawer onOpenConfigManager={() => setConfigManagerOpen(true)} />
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          {children}
        </Box>
      </Container>
      <ConfigurationManager 
        open={configManagerOpen} 
        onClose={() => setConfigManagerOpen(false)} 
      />
    </Box>
  );
};

export default Layout;
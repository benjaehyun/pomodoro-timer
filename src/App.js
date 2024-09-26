import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { requestNotificationPermission } from './utils/notifications';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

const theme = createTheme({
  // Customize your theme here
});

function App() {

  useEffect(() => {
    const requestPermission = async () => {
      const permissionGranted = await requestNotificationPermission();
      if (permissionGranted) {
        console.log('Notification permission granted');
      } else {
        console.log('Notification permission denied');
      }
    };

    requestPermission();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
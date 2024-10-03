import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { requestNotificationPermission } from './utils/notifications';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingOverlay from './components/LoadingOverlay';
import { useDispatch, useSelector } from 'react-redux';
import { checkAndFetchUserData } from './features/authSlice';
import { fetchConfigurations } from './features/timerSlice';


const theme = createTheme({
  // Customize your theme here
});

function App() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector(state => state.auth);

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

  useEffect(() => {
    dispatch(checkAndFetchUserData());
  }, [dispatch]);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchConfigurations());
    }
  }, [isLoggedIn, dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {/* <LoadingOverlay isLoading={isLoading} /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
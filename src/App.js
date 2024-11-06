import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { requestNotificationPermission } from './utils/notifications';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { useDispatch, useSelector } from 'react-redux';
import { checkAndFetchUserData, setOfflineStatus } from './features/authSlice';
import { fetchConfigurations, setOfflineStatus as setTimerOfflineStatus } from './features/timerSlice';
import { syncAll } from './services/sync';

const theme = createTheme({
  // Customize your theme
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

  useEffect(() => {
    const handleOnline = async () => {
      dispatch(setOfflineStatus(false));
      dispatch(setTimerOfflineStatus(false));
      if (isLoggedIn) {
        try {
          await syncAll();
          dispatch(fetchConfigurations());
        } catch (error) {
          console.error('Error syncing data:', error);
        }
      }
    };

    const handleOffline = () => {
      dispatch(setOfflineStatus(true));
      dispatch(setTimerOfflineStatus(true));
    };

    // Set initial offline status
    dispatch(setOfflineStatus(!navigator.onLine));
    dispatch(setTimerOfflineStatus(!navigator.onLine));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch, isLoggedIn]);

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
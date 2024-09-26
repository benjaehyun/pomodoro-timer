import React, {useEffect} from 'react';
import {  Box, Typography } from '@mui/material';
import Layout from '../components/Layout';
import PomodoroTimer from '../components/PomodoroTimer';

const Home = () => {

  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  return (
    <Layout>
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Pomodoro Timer
        </Typography>
        <PomodoroTimer />
      </Box>
    </Layout>
  );
};

export default Home;
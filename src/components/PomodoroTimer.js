import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { tickTimer } from '../features/timerSlice';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';
import { sendNotification } from '../utils/notifications';

const PomodoroTimer = () => {
  const dispatch = useDispatch();
  const { isRunning, timeRemaining, currentPhase } = useSelector((state) => state.timer);
  const audioRef = useRef(new Audio('/audio/water-droplet.mp3'));

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        dispatch(tickTimer());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, dispatch]);

  useEffect(() => {
    if (timeRemaining === 0) {
      const message = currentPhase === 'work' ? 'Take a break!' : 'Back to work!';
      sendNotification('Pomodoro Timer', { body: message });
      audioRef.current.play();
    }
  }, [timeRemaining, currentPhase]);

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {currentPhase === 'work' ? 'Work Time' : 'Break Time'}
      </Typography>
      <TimerDisplay />
      <TimerControls />
    </Box>
  );
};

export default PomodoroTimer;
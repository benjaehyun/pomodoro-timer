import React from 'react';
import { useSelector } from 'react-redux';
import { Typography, Box, CircularProgress } from '@mui/material';

const TimerDisplay = () => {
  const { timeRemaining, currentPhase } = useSelector((state) => state.timer);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={(timeRemaining / (currentPhase === 'work' ? 25 * 60 : 5 * 60)) * 100}
        size={200}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h3" component="div" color="text.secondary">
          {formatTime(timeRemaining)}
        </Typography>
      </Box>
    </Box>
  );
};

export default TimerDisplay;
import React from 'react';
import { useSelector } from 'react-redux';
import { Typography, Box, CircularProgress } from '@mui/material';

const TimerDisplay = () => {
  const { timeRemaining, currentCycleId, cycles } = useSelector((state) => state.timer);

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  };

  const currentCycle = cycles.find(cycle => cycle.id === currentCycleId);
  const progress = currentCycle 
    ? Math.min(Math.max(((currentCycle.duration - timeRemaining) / currentCycle.duration) * 100, 0), 100)
    : 0;

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={progress}
        size={200}
        thickness={4}
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
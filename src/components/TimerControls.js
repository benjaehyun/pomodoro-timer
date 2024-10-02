import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Box } from '@mui/material';
import { startTimer, pauseTimer, resetTimer } from '../features/timerSlice';

const TimerControls = () => {
  const dispatch = useDispatch();
  const { isRunning } = useSelector((state) => state.timer);

  return (
    <Box sx={{ my: 2 }}>
      {!isRunning ? (
        <Button variant="contained" color="primary" onClick={() => dispatch(startTimer())}>
          Start
        </Button>
      ) : (
        <Button variant="contained" color="secondary" onClick={() => dispatch(pauseTimer())}>
          Pause
        </Button>
      )}
      <Button variant="outlined" sx={{ ml: 2 }} onClick={() => dispatch(resetTimer())}>
        Reset
      </Button>
    </Box>
  );
};

export default TimerControls;
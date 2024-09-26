import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Fab, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { tickTimer, setCurrentCycle } from '../features/timerSlice';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';
import DraggableCycleList from './DraggableCycleList';
import CycleForm from './CycleForm';
import { sendNotification } from '../utils/notifications';

const PomodoroTimer = () => {
  const dispatch = useDispatch();
  const { isRunning, timeRemaining, cycles, currentCycleIndex } = useSelector((state) => state.timer);
  const audioRef = useRef(new Audio('/audio/water-droplet.mp3'));
  const [showCycleForm, setShowCycleForm] = useState(false);
  const [cycleToEdit, setCycleToEdit] = useState(null);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => dispatch(tickTimer()), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, dispatch]);

  useEffect(() => {
    if (timeRemaining === 0) {
      const nextIndex = (currentCycleIndex + 1) % cycles.length;
      const nextCycle = cycles[nextIndex];
      sendNotification('Pomodoro Timer', { body: `Time for ${nextCycle.label}!` });
      audioRef.current.play();
      dispatch(setCurrentCycle(nextIndex));
    }
  }, [timeRemaining, cycles, currentCycleIndex, dispatch]);

  const handleEditCycle = (cycle) => {
    setCycleToEdit(cycle);
    setShowCycleForm(true);
  };

  const handleCloseCycleForm = () => {
    setShowCycleForm(false);
    setCycleToEdit(null);
  };

  const currentCycle = cycles[currentCycleIndex];

  return (
    <Box sx={{ textAlign: 'center', mt: 4, position: 'relative', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        {currentCycle.label}
      </Typography>
      <TimerDisplay />
      <TimerControls />
      {currentCycle.note && (
        <Paper elevation={3} sx={{ p: 2, my: 2, mx: 'auto', maxWidth: 'sm' }}>
          <Typography variant="body1" fontStyle="italic">
            Note: {currentCycle.note}
          </Typography>
        </Paper>
      )}
      <Box sx={{ mt: 4, mx: 2 }}>
        <DraggableCycleList onEditCycle={handleEditCycle} />
      </Box>
      <Fab 
        color="primary" 
        aria-label="add" 
        onClick={() => setShowCycleForm(true)}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>
      <CycleForm
        cycleToEdit={cycleToEdit}
        open={showCycleForm}
        onClose={handleCloseCycleForm}
      />
    </Box>
  );
};

export default PomodoroTimer;
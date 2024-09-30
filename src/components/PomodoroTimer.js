import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Fab, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { tickTimer, setCurrentCycle } from '../features/timerSlice';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';
import DraggableCycleList from './DraggableCycleList';
import CycleForm from './CycleForm';
import { sendNotification } from '../utils/notifications';
import ConfigurationSelector from './ConfigurationSelector';

const PomodoroTimer = () => {
  const dispatch = useDispatch();
  const { isRunning, timeRemaining, cycles, currentCycleId } = useSelector((state) => state.timer);
  const audioRef = useRef(new Audio('/audio/water-droplet.mp3'));
  const [showCycleForm, setShowCycleForm] = useState(false);
  const [cycleToEdit, setCycleToEdit] = useState(null);
  const [isListExpanded, setIsListExpanded] = useState(true);
  const currentCycle = cycles.find(cycle => cycle.id === currentCycleId);

  useEffect(() => {
    let interval;
    if (isRunning && currentCycleId) {
      interval = setInterval(() => dispatch(tickTimer()), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, currentCycleId, dispatch, currentCycle?.duration]);

  useEffect(() => {
    if (timeRemaining === 0 && cycles.length > 0 && currentCycleId) {
      const currentIndex = cycles.findIndex(cycle => cycle.id === currentCycleId);
      const nextIndex = (currentIndex + 1) % cycles.length;
      const nextCycle = cycles[nextIndex];
      sendNotification('Pomodoro Timer', { body: `Time for ${nextCycle.label}!` });
      audioRef.current.play();
      dispatch(setCurrentCycle(nextCycle.id));
    }
  }, [timeRemaining, cycles, currentCycleId, dispatch]);

  // const handleEditCycle = (cycle) => {
  //   setCycleToEdit(cycle);
  //   setShowCycleForm(true);
  // };

  // const handleCloseCycleForm = () => {
  //   setShowCycleForm(false);
  //   setCycleToEdit(null);
  // };
  const handleEditCycle = (cycle) => {
    setCycleToEdit(cycle);
    setShowCycleForm(true);
  };

  const handleCloseCycleForm = () => {
    setShowCycleForm(false);
    setCycleToEdit(null);
    // dispatch(updateCurrentConfigurationToCustom());
  };

  const handleAddCycle = () => {
    setShowCycleForm(true);
    setCycleToEdit(null);
  };


  return (
    <Box sx={{ textAlign: 'center', mt: 4, position: 'relative', minHeight: '100vh' }}>
      <ConfigurationSelector />
      {cycles.length > 0 ? (
        <>
          <Typography variant="h4" gutterBottom>
            {currentCycle ? currentCycle.label : 'No active cycle'}
          </Typography>
          <TimerDisplay />
          <TimerControls />
          {currentCycle && currentCycle.note && (
            <Paper elevation={3} sx={{ p: 2, my: 2, mx: 'auto', maxWidth: 'sm' }}>
              <Typography variant="body1" fontStyle="italic">
                Note: {currentCycle.note}
              </Typography>
            </Paper>
          )}
        </>
      ) : (
        <Typography variant="h5" gutterBottom>
          No cycles available. Select a configuration or add a new cycle to start the timer.
        </Typography>
      )}
      <Accordion 
        expanded={isListExpanded} 
        onChange={() => setIsListExpanded(!isListExpanded)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Cycles</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <DraggableCycleList onEditCycle={handleEditCycle} />
        </AccordionDetails>
      </Accordion>
      <Fab 
        color="primary" 
        aria-label="add" 
        onClick={handleAddCycle}
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
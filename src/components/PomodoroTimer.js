import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, Typography, Fab, Paper, Accordion, AccordionSummary, AccordionDetails, 
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { tickTimer, setCurrentCycle, updateConfiguration, saveConfigurationAsync } from '../features/timerSlice';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';
import DraggableCycleList from './DraggableCycleList';
import CycleForm from './CycleForm';
import { sendNotification } from '../utils/notifications';
import ConfigurationSelector from './ConfigurationSelector';

const PomodoroTimer = () => {
  const dispatch = useDispatch();
  const { isRunning, timeRemaining, cycles, currentCycleId, currentConfigId, configurations } = useSelector((state) => state.timer);
  const audioRef = useRef(new Audio('/audio/water-droplet.mp3'));
  const [showCycleForm, setShowCycleForm] = useState(false);
  const [cycleToEdit, setCycleToEdit] = useState(null);
  const [isListExpanded, setIsListExpanded] = useState(true);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [configName, setConfigName] = useState('');
  const currentConfig = configurations.find(config => config.id === currentConfigId);
  const currentCycle = cycles.find(cycle => cycle.id === currentCycleId);

  useEffect(() => {
    let interval;
    if (isRunning && currentCycleId) {
      interval = setInterval(() => dispatch(tickTimer()), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, currentCycleId, dispatch]);

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

  const handleSaveChanges = () => {
    setConfigName(currentConfig ? currentConfig.name : '');
    setSaveDialogOpen(true);
  };

  const handleSave = (saveAsNew) => {
    const configToSave = {
      ...(saveAsNew ? {} : { id: currentConfigId }),
      name: configName,
      cycles: cycles,
    };

    if (saveAsNew) {
      dispatch(saveConfigurationAsync(configToSave));
    } else {
      dispatch(updateConfiguration(configToSave));
    }
    setSaveDialogOpen(false);
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
      <Button onClick={handleSaveChanges} sx={{ mt: 2 }}>
        Save Changes
      </Button>
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Configuration</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Configuration Name"
            fullWidth
            value={configName}
            onChange={(e) => setConfigName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          {currentConfig && !currentConfig.isDefault && (
            <Button onClick={() => handleSave(false)}>Update Existing</Button>
          )}
          <Button onClick={() => handleSave(true)}>Save as New</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PomodoroTimer;
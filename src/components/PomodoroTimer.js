import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, Typography, Fab, Paper, Accordion, AccordionSummary, AccordionDetails, 
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Chip, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import SyncIcon from '@mui/icons-material/Sync';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import { tickTimer, setCurrentCycle, updateConfiguration, saveConfigurationAsync, updateConfigurationAsync, clearError, resetCustomConfiguration, defaultQuickAccessConfigurations } from '../features/timerSlice';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';
import DraggableCycleList from './DraggableCycleList';
import CycleForm from './CycleForm';
import { sendNotification } from '../utils/notifications';
import ConfigurationSelector from './ConfigurationSelector';

const PomodoroTimer = () => {
  const dispatch = useDispatch();
  const { isRunning, timeRemaining, cycles, currentCycleId, currentConfigId, configurations, error, syncStatus } = useSelector((state) => state.timer);
  const { isLoggedIn, isOffline } = useSelector((state) => state.auth);
  const audioRef = useRef(new Audio('/audio/water-droplet.mp3'));
  const [showCycleForm, setShowCycleForm] = useState(false);
  const [cycleToEdit, setCycleToEdit] = useState(null);
  const [isListExpanded, setIsListExpanded] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [configName, setConfigName] = useState('');
  const currentConfig = configurations.find(config => config._id === currentConfigId);
  const currentCycle = cycles.find(cycle => cycle.id === currentCycleId);
  const [isUpdatable, setIsUpdatable] = useState(false);

  useEffect(() => {
    if (currentConfig) {
      const isUpdatable = currentConfig._id === 'custom'
        ? currentConfig.originalConfigId !== null && !defaultQuickAccessConfigurations.includes(currentConfig.originalConfigId)
        : !defaultQuickAccessConfigurations.includes(currentConfig._id);
      
      setIsUpdatable(isUpdatable);
    }
  }, [currentConfig]);

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
      sendNotification('Pomodoro Timer', { 
        body: `Time for ${nextCycle.label}!`,
        icon: '/favicon.ico' 
      });
      audioRef.current.play();
      dispatch(setCurrentCycle(nextCycle.id));
    }
  }, [timeRemaining, cycles, currentCycleId, dispatch]);

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
    const customConfig = configurations.find( c=> c._id === 'custom'); 
    const configToSave = {
      ...(saveAsNew ? {} : { _id: currentConfigId }), //currentConfig._id
      name: configName,
      cycles: cycles,
    };

    if (saveAsNew) {
      dispatch(saveConfigurationAsync(configToSave));
    } else {
      // dispatch(updateConfiguration(configToSave));
      // dispatch(updateConfigurationAsync({ _id: currentConfig._id, configuration: configToSave }));
      const idToUpdate = customConfig.originalConfigId || currentConfigId;
      if (idToUpdate && idToUpdate !== 'custom') {
        dispatch(updateConfigurationAsync({ _id: idToUpdate, configuration: configToSave }));
      } else {
        console.error('No valid configuration ID to update');
      }
    }
    dispatch(resetCustomConfiguration());
    setSaveDialogOpen(false);
  };

  const handleCloseSnackbar = () => {
    dispatch(clearError());
  };

  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case 'synced': return <CloudDoneIcon />;
      case 'syncing': return <SyncIcon />;
      case 'unsynced': return <CloudOffIcon />;
      default: return null;
    }
  };

  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case 'synced': return 'success';
      case 'syncing': return 'info';
      case 'unsynced': return 'warning';
      default: return 'default';
    }
  };

  const getSyncStatusTooltip = () => {
    switch (syncStatus) {
      case 'synced': return 'All changes are synced';
      case 'syncing': return 'Syncing changes...';
      case 'unsynced': return 'Changes pending sync';
      default: return '';
    }
  };

  return (
    <Box sx={{ textAlign: 'center', mt: 4, position: 'relative'}}>
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
      {isLoggedIn && (
        <Box sx={{ position: 'fixed', bottom: 16, left: 16, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {isOffline && (
            <Tooltip title="You are offline. Changes will sync when you're back online.">
              <Chip
                icon={<WifiOffIcon />}
                label="Offline"
                color="error"
                size="small"
              />
            </Tooltip>
          )}
          <Tooltip title={getSyncStatusTooltip()}>
            <Chip
              icon={getSyncStatusIcon()}
              label={syncStatus}
              color={getSyncStatusColor()}
              size="small"
            />
          </Tooltip>
        </Box>
      )}
      <CycleForm
        cycleToEdit={cycleToEdit}
        open={showCycleForm}
        onClose={handleCloseCycleForm}
      />
        {cycles.length > 0 && (<Button onClick={handleSaveChanges} sx={{ mt: 2 }}>
        Save Changes
      </Button>)}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)} maxWidth="sm" fullWidth>
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
          {currentConfig && isUpdatable && (
            <Button onClick={() => handleSave(false)}>Update</Button>
          )}
          <Button onClick={() => handleSave(true)}>Save as New</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error}
      />
    </Box>
  );
};

export default PomodoroTimer;
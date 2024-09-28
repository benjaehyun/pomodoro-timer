import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Select, MenuItem, FormControl, InputLabel, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { setConfiguration, saveCustomConfiguration } from '../features/timerSlice';
import EditIcon from '@mui/icons-material/Edit';

const ConfigurationSelector = () => {
  const dispatch = useDispatch();
  const { configurations, currentConfigId } = useSelector(state => state.timer);
  const { isLoggedIn } = useSelector(state => state.auth);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [newConfigName, setNewConfigName] = useState('');

  const handleChange = (event) => {
    dispatch(setConfiguration(event.target.value));
  };

  const handleSaveConfiguration = () => {
    dispatch(saveCustomConfiguration({ name: newConfigName }));
    setOpenSaveDialog(false);
    setNewConfigName('');
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <FormControl fullWidth sx={{ mr: 2 }}>
        <InputLabel id="configuration-select-label">Cycle Configuration</InputLabel>
        <Select
          labelId="configuration-select-label"
          id="configuration-select"
          value={currentConfigId}
          label="Cycle Configuration"
          onChange={handleChange}
        >
          {configurations.map((config) => (
            <MenuItem key={config.id} value={config.id}>
              {config.name}
              {config.id === 'custom' && <EditIcon fontSize="small" sx={{ ml: 1 }} />}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {isLoggedIn && currentConfigId === 'custom' && (
        <Button variant="outlined" onClick={() => setOpenSaveDialog(true)}>
          Save Configuration
        </Button>
      )}
      <Dialog open={openSaveDialog} onClose={() => setOpenSaveDialog(false)}>
        <DialogTitle>Save Configuration</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Configuration Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newConfigName}
            onChange={(e) => setNewConfigName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSaveDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveConfiguration}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConfigurationSelector;
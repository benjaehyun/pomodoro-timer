import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { setConfiguration } from '../features/timerSlice';

const ConfigurationSelector = () => {
  const dispatch = useDispatch();
  const { configurations, currentConfigId } = useSelector(state => state.timer);

  const handleChange = (event) => {
    dispatch(setConfiguration(event.target.value));
  };

  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
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
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ConfigurationSelector;
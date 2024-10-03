import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Select, MenuItem, FormControl, InputLabel, Box, ListSubheader } from '@mui/material';
import { setConfiguration } from '../features/timerSlice';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const ConfigurationSelector = () => {
  const dispatch = useDispatch();
  const { configurations, currentConfigId, visibleConfigurations } = useSelector(state => state.timer);

  const handleChange = (event) => {
    dispatch(setConfiguration(event.target.value));
  };

  const currentConfig = configurations.find(config => config._id === currentConfigId);
  const visibleConfigs = configurations.filter(config => 
    visibleConfigurations.includes(config._id) || config._id === 'custom'
  );
  const isCurrentConfigVisible = visibleConfigurations.includes(currentConfigId) || currentConfigId === 'custom';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <FormControl fullWidth>
        <InputLabel id="configuration-select-label">Cycle Configuration</InputLabel>
        <Select
          labelId="configuration-select-label"
          id="configuration-select"
          value={currentConfigId}
          label="Cycle Configuration"
          onChange={handleChange}
        >
          {!isCurrentConfigVisible && (
            <MenuItem value={currentConfig._id}>
            {/* <MenuItem value={currentConfigId}> */}
              {currentConfig.name}
            </MenuItem>
          )}
          {visibleConfigs.length > 0 && (
            <ListSubheader>Quick Access</ListSubheader>
          )}
          {visibleConfigs.map((config) => (
            <MenuItem key={config._id} value={config._id}>
              {config._id === 'custom' && (
                <AddCircleOutlineIcon fontSize="small" sx={{ mr: 1 }} />
              )}
              {config.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ConfigurationSelector;
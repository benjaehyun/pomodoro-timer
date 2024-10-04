import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Select, MenuItem, FormControl, InputLabel, Box, ListSubheader, IconButton, Tooltip, Typography } from '@mui/material';
import { setConfiguration, resetCustomConfiguration } from '../features/timerSlice';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RestartAlt from '@mui/icons-material/RestartAlt';

const ConfigurationSelector = () => {
  const dispatch = useDispatch();
  const { configurations, currentConfigId, visibleConfigurations } = useSelector(state => state.timer);

  const handleChange = (event) => {
    dispatch(setConfiguration(event.target.value));
  };

  const handleResetConfiguration = () => {
    dispatch(resetCustomConfiguration());
    dispatch(setConfiguration('custom'));
  };

  const currentConfig = configurations.find(config => config._id === currentConfigId);
  const visibleConfigs = configurations.filter(config => 
    visibleConfigurations.includes(config._id) || config._id === 'custom'
  );
  const isCurrentConfigVisible = visibleConfigurations.includes(currentConfigId) || currentConfigId === 'custom';

  return (
    <Box sx={{ display: 'flex', alignItems: 'stretch', mb: 2 }}>
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
      {currentConfig && currentConfig._id === 'custom' && (
        <Tooltip title="Reset Custom Configuration">
          <Box
            onClick={handleResetConfiguration}
            sx={{
              ml: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              px: 2,
              '&:hover': {
                backgroundColor: 'action.hover',
                '& .MuiSvgIcon-root': {
                  color: 'primary.main',
                },
                '& .MuiTypography-root': {
                  color: 'primary.main',
                },
              },
            }}
          >
            <RestartAlt 
              sx={{
                fontSize: 24,
                color: 'action.active',
                transition: 'color 0.3s ease-in-out',
              }}
            />
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                color: 'text.secondary',
                transition: 'color 0.3s ease-in-out',
              }}
            >
              Reset
            </Typography>
          </Box>
        </Tooltip>
      )}
    </Box>
  );
};

export default ConfigurationSelector;
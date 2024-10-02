import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, 
  IconButton, Switch, Box, Typography
} from '@mui/material';
import { Edit, Delete, Close } from '@mui/icons-material';
import { 
  setConfiguration, deleteConfigurationAsync, updateQuickAccessConfigurations
} from '../features/timerSlice';

const defaultConfigurationIds = ['classic-pomodoro', '52-17-focus', '90-minute-focus'];

const ConfigurationManager = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { configurations, visibleConfigurations } = useSelector(state => state.timer);
  const [localVisibleConfigurations, setLocalVisibleConfigurations] = useState(visibleConfigurations);

  useEffect(() => {
    // Reset local state when dialog opens
    if (open) {
      setLocalVisibleConfigurations(visibleConfigurations);
    }
  }, [open, visibleConfigurations]);

  const handleClose = () => {
    // Check if there are any changes
    if (JSON.stringify(localVisibleConfigurations) !== JSON.stringify(visibleConfigurations)) {
      dispatch(updateQuickAccessConfigurations(localVisibleConfigurations));
    }
    onClose();
  };

  const handleSelect = (configId) => {
    dispatch(setConfiguration(configId));
    handleClose()
    navigate('/');
  };

  // const handleToggleVisibility = (configId) => {
  //   dispatch(toggleConfigVisibility(configId));
  // };
  const handleToggleVisibility = (configId) => {
    setLocalVisibleConfigurations(prev => 
      prev.includes(configId)
        ? prev.filter(id => id !== configId)
        : [...prev, configId]
    );
  };

  const handleEdit = (configId) => {
    dispatch(setConfiguration(configId));
    handleClose()
    navigate('/');
  };

  const handleDelete = (id) => {
    dispatch(deleteConfigurationAsync(id));
  };

  

  const filteredConfigurations = configurations.filter(config => config.id !== 'custom');

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Manage Configurations
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ paddingTop: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, mt: 2 }}>
          <Typography variant="subtitle2">Configuration</Typography>
          <Typography variant="subtitle2">Quick Access</Typography>
        </Box>
        <List sx={{ maxHeight: '60vh', overflow: 'auto' }}>
          {filteredConfigurations.map((config) => {
            const isDefault = defaultConfigurationIds.includes(config.id);
            return (
              <ListItem 
                key={config.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid #e0e0e0',
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <ListItemText 
                  primary={config.name} 
                  onClick={() => handleSelect(config.id)}
                  sx={{ cursor: 'pointer', flexGrow: 1 }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    {visibleConfigurations.includes(config.id) ? 'Visible' : 'Hidden'}
                  </Typography>
                  {/* <Switch
                    checked={visibleConfigurations.includes(config.id)}
                    onChange={() => handleToggleVisibility(config.id)}
                    color="primary"
                  /> */}
                  <Switch
                    checked={localVisibleConfigurations.includes(config.id)}
                    onChange={() => handleToggleVisibility(config.id)}
                  />
                  {!isDefault && (
                    <>
                      <IconButton aria-label="edit" onClick={() => handleEdit(config.id)} size="small">
                        <Edit />
                      </IconButton>
                      <IconButton aria-label="delete" onClick={() => handleDelete(config.id)} size="small">
                        <Delete />
                      </IconButton>
                    </>
                  )}
                </Box>
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigurationManager;
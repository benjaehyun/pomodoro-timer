import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, 
  IconButton, Button, Switch, Box, Typography 
} from '@mui/material';
import { Edit, Delete, Visibility, VisibilityOff } from '@mui/icons-material';
import { 
  setConfiguration, deleteConfigurationAsync, toggleConfigVisibility 
} from '../features/timerSlice';

const ConfigurationManager = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { configurations, visibleConfigurations } = useSelector(state => state.timer);
  const { isLoggedIn } = useSelector(state => state.auth);

  const handleSelect = (configId) => {
    dispatch(setConfiguration(configId));
    onClose();
    navigate('/');  // Navigate to home/timer page
  };

  const handleToggleVisibility = (configId) => {
    dispatch(toggleConfigVisibility(configId));
  };

  const handleEdit = (configId) => {
    dispatch(setConfiguration(configId));
    onClose();
    navigate('/');  // Navigate to home/timer page
  };

  const handleDelete = (id) => {
    dispatch(deleteConfigurationAsync(id));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Manage Configurations</DialogTitle>
      <DialogContent>
        {isLoggedIn ? (
          <List>
            {configurations.map((config) => (
              <ListItem key={config.id}>
                <ListItemText 
                  primary={config.name} 
                  onClick={() => handleSelect(config.id)}
                  style={{ cursor: 'pointer' }}
                />
                <Switch
                  checked={visibleConfigurations.includes(config.id)}
                  onChange={() => handleToggleVisibility(config.id)}
                  icon={<VisibilityOff />}
                  checkedIcon={<Visibility />}
                />
                {!config.isDefault && (
                  <>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(config.id)}>
                      <Edit />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(config.id)}>
                      <Delete />
                    </IconButton>
                  </>
                )}
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>Please log in to manage configurations.</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ConfigurationManager;
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, 
  IconButton, Switch, Box, Typography, Divider
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
    // reset state when dialog opens
    if (open) {
      setLocalVisibleConfigurations(visibleConfigurations);
    }
  }, [open, visibleConfigurations]);

  const handleClose = () => {
    // check for any changes
    if (JSON.stringify(localVisibleConfigurations) !== JSON.stringify(visibleConfigurations)) {
      dispatch(updateQuickAccessConfigurations(localVisibleConfigurations));
    }
    onClose();
  };

  const handleSelect = (_id) => {
    dispatch(setConfiguration(_id));
    handleClose()
    navigate('/');
  };

  // const handleToggleVisibility = (configId) => {
  //   dispatch(toggleConfigVisibility(configId));
  // };
  const handleToggleVisibility = (_id) => {
    setLocalVisibleConfigurations(prev => 
      prev.includes(_id)
        ? prev.filter(id => id !== _id)
        : [...prev, _id]
    );
  };

  const handleEdit = (_id) => {
    dispatch(setConfiguration(_id));
    handleClose()
    navigate('/');
  };

  const handleDelete = (_id) => {
    dispatch(deleteConfigurationAsync(_id));
  };

  

  const filteredConfigurations = configurations.filter(config => config._id !== 'custom');

  const defaultConfigs = configurations.filter(config => defaultConfigurationIds.includes(config._id));
  const userConfigs = configurations.filter(config => !defaultConfigurationIds.includes(config._id) && config._id !== 'custom');

  // return (
  //   <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
  //     <DialogTitle>
  //       Manage Configurations
  //       <IconButton
  //         aria-label="close"
  //         onClick={handleClose}
  //         sx={{
  //           position: 'absolute',
  //           right: 8,
  //           top: 8,
  //           color: (theme) => theme.palette.grey[500],
  //         }}
  //       >
  //         <Close />
  //       </IconButton>
  //     </DialogTitle>
  //     <DialogContent sx={{ paddingTop: 0 }}>
  //       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, mt: 2 }}>
  //         <Typography variant="subtitle2">Configuration</Typography>
  //         <Typography variant="subtitle2">Quick Access</Typography>
  //       </Box>
  //       <List sx={{ maxHeight: '60vh', overflow: 'auto' }}>
  //         {filteredConfigurations.map((config) => {
  //           const isDefault = defaultConfigurationIds.includes(config.id);
  //           return (
  //             <ListItem 
  //               key={config.id}
  //               sx={{
  //                 display: 'flex',
  //                 justifyContent: 'space-between',
  //                 alignItems: 'center',
  //                 borderBottom: '1px solid #e0e0e0',
  //                 '&:last-child': { borderBottom: 'none' },
  //               }}
  //             >
  //               <ListItemText 
  //                 primary={config.name} 
  //                 onClick={() => handleSelect(config.id)}
  //                 sx={{ cursor: 'pointer', flexGrow: 1 }}
  //               />
  //               <Box sx={{ display: 'flex', alignItems: 'center' }}>
  //                 <Typography variant="body2" sx={{ mr: 1 }}>
  //                   {visibleConfigurations.includes(config.id) ? 'Visible' : 'Hidden'}
  //                 </Typography>
  //                 {/* <Switch
  //                   checked={visibleConfigurations.includes(config.id)}
  //                   onChange={() => handleToggleVisibility(config.id)}
  //                   color="primary"
  //                 /> */}
  //                 <Switch
  //                   checked={localVisibleConfigurations.includes(config.id)}
  //                   onChange={() => handleToggleVisibility(config.id)}
  //                 />
  //                 {!isDefault && (
  //                   <>
  //                     <IconButton aria-label="edit" onClick={() => handleEdit(config.id)} size="small">
  //                       <Edit />
  //                     </IconButton>
  //                     <IconButton aria-label="delete" onClick={() => handleDelete(config.id)} size="small">
  //                       <Delete />
  //                     </IconButton>
  //                   </>
  //                 )}
  //               </Box>
  //             </ListItem>
  //           );
  //         })}
  //       </List>
  //     </DialogContent>
  //   </Dialog>
  // );

  const renderConfigList = (configs, isDefault) => (
    <List sx={{ maxHeight: '60vh', overflow: 'auto' }}>
      {configs.map((config) => (
        <ListItem 
          key={config._id}
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
            onClick={() => handleSelect(config._id)}
            sx={{ cursor: 'pointer', flexGrow: 1 }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              {localVisibleConfigurations.includes(config._id) ? 'Visible' : 'Hidden'}
            </Typography>
            <Switch
              checked={localVisibleConfigurations.includes(config._id)}
              onChange={() => handleToggleVisibility(config._id)}
              color="primary"
            />
            {!isDefault && (
              <>
                <IconButton aria-label="edit" onClick={() => handleEdit(config._id)} size="small">
                  <Edit />
                </IconButton>
                <IconButton aria-label="delete" onClick={() => handleDelete(config._id)} size="small">
                  <Delete />
                </IconButton>
              </>
            )}
          </Box>
        </ListItem>
      ))}
    </List>
  );

  return (
    <Dialog 
    open={open} 
    onClose={handleClose} 
    fullWidth 
    maxWidth="sm" 
    disableRestoreFocus
    container={() => document.body}
    >
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 1 }}>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
            Default Configurations
          </Typography>
          <Typography variant="subtitle2" sx={{mr: 3}}>
            Quick Access
          </Typography>
        </Box>
        {renderConfigList(defaultConfigs, true)}
        {userConfigs.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, color: 'text.secondary' }}>
              User Configurations
            </Typography>
            {renderConfigList(userConfigs, false)}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ConfigurationManager;
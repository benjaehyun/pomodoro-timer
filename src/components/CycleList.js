import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCycles } from '../features/cyclesSlice';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

const CycleList = () => {
  const dispatch = useDispatch();
  const cycles = useSelector(state => state.cycles.cycles);
  const cycleStatus = useSelector(state => state.cycles.status);

  useEffect(() => {
    if (cycleStatus === 'idle') {
      dispatch(fetchCycles());
    }
  }, [cycleStatus, dispatch]);

  if (cycleStatus === 'loading') {
    return <Typography>Loading cycles...</Typography>;
  }

  return (
    <List>
      {cycles.map((cycle) => (
        <ListItem key={cycle._id}>
          <ListItemText 
            primary={cycle.label} 
            secondary={`Duration: ${cycle.duration} minutes`} 
          />
        </ListItem>
      ))}
    </List>
  );
};

export default CycleList;
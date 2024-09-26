import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addCycle } from '../features/cyclesSlice';
import { TextField, Button, Box } from '@mui/material';

const AddCycleForm = () => {
  const [label, setLabel] = useState('');
  const [duration, setDuration] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (label && duration) {
      dispatch(addCycle({ label, duration: parseInt(duration, 10) }));
      setLabel('');
      setDuration('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ '& > :not(style)': { m: 1 } }}>
        <TextField
          label="Cycle Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
        />
        <TextField
          label="Duration (minutes)"
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
        <Button type="submit" variant="contained">Add Cycle</Button>
      </Box>
    </form>
  );
};

export default AddCycleForm;
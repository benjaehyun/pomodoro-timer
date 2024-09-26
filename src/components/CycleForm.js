import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
  TextField, 
  Button, 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Slider,
  Typography
} from '@mui/material';
import { addCycle, updateCycle } from '../features/timerSlice';

const MAX_NOTE_LENGTH = 500; // Set the maximum note length

const CycleForm = ({ cycleToEdit, open, onClose }) => {
  const dispatch = useDispatch();
  const [cycle, setCycle] = useState({ label: '', duration: 25, note: '' });

  useEffect(() => {
    if (cycleToEdit) {
      setCycle({ ...cycleToEdit, duration: cycleToEdit.duration / 60 });
    } else {
      setCycle({ label: '', duration: 25, note: '' });
    }
  }, [cycleToEdit]);

  const handleSubmit = () => {
    const newCycle = { ...cycle, duration: cycle.duration * 60, id: cycle.id || Date.now().toString() };
    if (cycleToEdit) {
      dispatch(updateCycle(newCycle));
    } else {
      dispatch(addCycle(newCycle));
    }
    onClose();
  };

  const handleNoteChange = (e) => {
    const newNote = e.target.value.slice(0, MAX_NOTE_LENGTH);
    setCycle({ ...cycle, note: newNote });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{cycleToEdit ? 'Edit Cycle' : 'Add New Cycle'}</DialogTitle>
      <DialogContent>
        <Box sx={{ '& > :not(style)': { my: 2 } }}>
          <TextField
            label="Label"
            value={cycle.label}
            onChange={(e) => setCycle({ ...cycle, label: e.target.value })}
            required
            fullWidth
          />
          <Typography gutterBottom>Duration: {cycle.duration} minutes</Typography>
          <Slider
            value={cycle.duration}
            onChange={(_, newValue) => setCycle({ ...cycle, duration: newValue })}
            min={1}
            max={60}
            step={1}
            marks
            valueLabelDisplay="auto"
          />
          <TextField
            label="Note"
            value={cycle.note}
            onChange={handleNoteChange}
            multiline
            rows={4}
            fullWidth
            inputProps={{ maxLength: MAX_NOTE_LENGTH }}
            helperText={`${cycle.note.length}/${MAX_NOTE_LENGTH}`}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {cycleToEdit ? 'Update' : 'Add'} Cycle
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CycleForm;
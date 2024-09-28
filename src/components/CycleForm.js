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
import { addCycle, updateCycle, updateCurrentConfigurationToCustom } from '../features/timerSlice';

const MAX_NOTE_LENGTH = 500;
const initialCycleState = { label: '', duration: 25, note: '' };

const CycleForm = ({ cycleToEdit, open, onClose }) => {
  const dispatch = useDispatch();
  const [cycle, setCycle] = useState(initialCycleState);
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    if (open) {
      if (cycleToEdit) {
        setCycle({ ...cycleToEdit, duration: cycleToEdit.duration / 60 });
      } else {
        setCycle(initialCycleState);
      }
      setIsEdited(false);
    }
  }, [open, cycleToEdit]);

  // const handleSubmit = () => {
  //   const newCycle = { ...cycle, duration: cycle.duration * 60, id: cycle.id || Date.now().toString() };
  //   if (cycleToEdit) {
  //     dispatch(updateCycle(newCycle));
  //   } else {
  //     dispatch(addCycle(newCycle));
  //   }
  //   onClose();
  // };
  const handleSubmit = () => {
    const newCycle = { ...cycle, duration: cycle.duration * 60, id: cycle.id || Date.now().toString() };
    if (cycleToEdit) {
      dispatch(updateCycle(newCycle));
    } else {
      dispatch(addCycle(newCycle));
    }
    dispatch(updateCurrentConfigurationToCustom());
    onClose(true);
  };

  const handleCancel = () => {
    onClose(false);
  };

  const handleChange = (field, value) => {
    setCycle(prev => ({ ...prev, [field]: value }));
    setIsEdited(true);
  };

  const handleNoteChange = (e) => {
    const newNote = e.target.value.slice(0, MAX_NOTE_LENGTH);
    handleChange('note', newNote);
  };


  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
      <DialogTitle>{cycleToEdit ? 'Edit Cycle' : 'Add New Cycle'}</DialogTitle>
      <DialogContent>
        <Box sx={{ '& > :not(style)': { my: 2 } }}>
          <TextField
              label="Label"
              value={cycle.label}
              onChange={(e) => handleChange('label', e.target.value)}
              required
              fullWidth
            />
            <Typography gutterBottom>Duration: {cycle.duration} minutes</Typography>
            <Slider
              value={cycle.duration}
              onChange={(_, newValue) => handleChange('duration', newValue)}
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
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!isEdited}>
          {cycleToEdit ? 'Update' : 'Add'} Cycle
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CycleForm;
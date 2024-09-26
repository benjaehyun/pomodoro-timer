import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import AddCycleForm from '../components/AddCycleForm';
import DraggableCycleList from '../components/DraggableCycleList';

function CycleManagement() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Pomodoro Timer Cycles
        </Typography>
        <AddCycleForm />
        <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 4 }}>
          Current Cycles
        </Typography>
        <DraggableCycleList />
      </Box>
    </Container>
  );
}

export default CycleManagement;
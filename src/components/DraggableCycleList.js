import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { List, ListItem, IconButton, Box, Typography } from '@mui/material';
import { Delete, Edit, DragIndicator } from '@mui/icons-material';
import { reorderCycles, deleteCycle, setCurrentCycle } from '../features/timerSlice';

const DraggableCycleList = ({ onEditCycle }) => {
  const dispatch = useDispatch();
  const cycles = useSelector(state => state.timer.cycles);
  const currentCycleId = useSelector(state => state.timer.currentCycleId);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(cycles);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    dispatch(reorderCycles(items));
  };

  const truncateNote = (note, maxLength = 25) => {
    if (!note) return '';
    return note.length <= maxLength ? note : `${note.substr(0, maxLength)}...`;
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="cycles">
        {(provided) => (
          <List {...provided.droppableProps} ref={provided.innerRef}>
            {cycles.map((cycle, index) => (
              <Draggable key={cycle.id} draggableId={cycle.id} index={index}>
                {(provided, snapshot) => (
                  <ListItem
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    sx={{
                      backgroundColor: cycle.id === currentCycleId 
                        ? 'rgba(0, 150, 136, 0.1)' 
                        : snapshot.isDragging ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                      marginBottom: 1,
                      borderLeft: cycle.id === currentCycleId ? '4px solid #009688' : 'none',
                    }}
                  >
                    <IconButton {...provided.dragHandleProps} size="small">
                      <DragIndicator />
                    </IconButton>
                    <Box sx={{ flexGrow: 1, ml: 1 }} onClick={() => dispatch(setCurrentCycle(cycle.id))}>
                      <Typography variant="subtitle1">{cycle.label}</Typography>
                      <Typography variant="body2">{`${cycle.duration / 60} minutes`}</Typography>
                      {cycle.note && (
                        <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                          {truncateNote(cycle.note)}
                        </Typography>
                      )}
                    </Box>
                    <Box>
                      <IconButton onClick={() => onEditCycle(cycle)} size="small">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => dispatch(deleteCycle(cycle.id))} size="small">
                        <Delete />
                      </IconButton>
                    </Box>
                  </ListItem>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableCycleList;
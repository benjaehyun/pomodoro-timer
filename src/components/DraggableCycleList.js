import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { List, ListItem, ListItemText, IconButton, Box, Typography } from '@mui/material';
import { Delete, Edit, DragIndicator } from '@mui/icons-material';
import { reorderCycles, deleteCycle, setCurrentCycle } from '../features/timerSlice';

const DraggableCycleList = ({ onEditCycle }) => {
  const dispatch = useDispatch();
  const cycles = useSelector(state => state.timer.cycles);
  const currentCycleIndex = useSelector(state => state.timer.currentCycleIndex);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(cycles);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    dispatch(reorderCycles(items));
  };

  const truncateNote = (note, maxLength = 50) => {
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
                      backgroundColor: index === currentCycleIndex 
                        ? 'rgba(0, 150, 136, 0.1)' 
                        : snapshot.isDragging ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                      marginBottom: 1,
                      borderLeft: index === currentCycleIndex ? '4px solid #009688' : 'none',
                    }}
                  >
                    <IconButton {...provided.dragHandleProps} size="small">
                      <DragIndicator />
                    </IconButton>
                    <ListItemText
                      primary={cycle.label}
                      secondary={
                        <>
                          {`${cycle.duration / 60} minutes`}
                          {cycle.note && (
                            <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                              Note: {truncateNote(cycle.note)}
                            </Typography>
                          )}
                        </>
                      }
                      onClick={() => dispatch(setCurrentCycle(index))}
                      sx={{ flexGrow: 1, ml: 1 }}
                    />
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
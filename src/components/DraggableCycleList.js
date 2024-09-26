import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { updateCycleOrder } from '../features/cyclesSlice';
import { List, ListItem, ListItemText, Paper } from '@mui/material';

const DraggableCycleList = () => {
  const dispatch = useDispatch();
  const cycles = useSelector(state => state.cycles.cycles);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(cycles);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    dispatch(updateCycleOrder(items));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="cycles">
        {(provided) => (
          <List {...provided.droppableProps} ref={provided.innerRef}>
            {cycles.map((cycle, index) => (
              <Draggable key={cycle._id} draggableId={cycle._id} index={index}>
                {(provided) => (
                  <Paper
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    elevation={3}
                    sx={{ my: 1, p: 2 }}
                  >
                    <ListItem>
                      <ListItemText
                        primary={cycle.label}
                        secondary={`Duration: ${cycle.duration} minutes`}
                      />
                    </ListItem>
                  </Paper>
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
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TodoItem from './TodoItem';

const SortableTodoItem = ({ todo, disabled }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    cursor: disabled ? 'default' : 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <TodoItem 
        todo={todo} 
        dragHandleProps={disabled ? {} : listeners}
        isDragging={isDragging}
      />
    </div>
  );
};

export default SortableTodoItem;

import React from 'react';
import styled from '@emotion/styled';
import { useTodoContext } from '../contexts/TodoContext';
import TodoForm from './TodoForm';
import { parseDate, isValidDate } from '../utils/helpers';

// 拖拽手柄樣式
const DragHandle = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  cursor: grab;
  padding: ${props => props.theme.spacing.small};
  border-radius: ${props => props.theme.radius.small};
  transition: all ${props => props.theme.transitions.default};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${props => props.theme.spacing.small};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.hover};
  }
  
  &:active {
    cursor: grabbing;
  }

  &.disabled {
    color: ${props => props.theme.colors.border};
    cursor: not-allowed;
  }
`;

const TodoItemContainer = styled.div`
  background-color: ${props => props.theme.colors.backgroundSecondary};
  border-radius: ${props => props.theme.radius.medium};
  padding: ${props => props.theme.spacing.medium} ${props => props.theme.spacing.large};
  margin-bottom: ${props => props.theme.spacing.medium};
  box-shadow: 0 2px 4px ${props => props.theme.colors.shadow};
  transition: all ${props => props.theme.transitions.default};
  border-left: 4px solid ${props => props.completed 
    ? props.theme.colors.success 
    : props.theme.colors.primary};
  opacity: ${props => props.completed ? 0.8 : 1};
  
  &:hover {
    box-shadow: 0 4px 8px ${props => props.theme.colors.shadow};
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.completed ? '0' : props.theme.spacing.medium};
`;

const Title = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.large};
  color: ${props => props.completed 
    ? props.theme.colors.completedText 
    : props.theme.colors.text};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  margin: 0;
  flex: 1;
  word-break: break-word;
  transition: all ${props => props.theme.transitions.default};
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.medium};
`;

const Content = styled.div`
  color: ${props => props.completed 
    ? props.theme.colors.completedText 
    : props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.medium};
  margin-bottom: ${props => props.theme.spacing.medium};
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  transition: all ${props => props.theme.transitions.default};
  opacity: ${props => props.completed ? 0.8 : 1};
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid ${props => props.theme.colors.border};
  padding-top: ${props => props.theme.spacing.small};
  margin-top: ${props => props.theme.spacing.small};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.small};
`;

const Tag = styled.span`
  background-color: ${props => props.theme.colors.tag};
  color: ${props => props.theme.colors.tagText};
  padding: ${props => props.theme.spacing.small};
  border-radius: ${props => props.theme.radius.large};
  font-size: ${props => props.theme.typography.fontSize.small};
`;

const Date = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.small};
  opacity: 0.8;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.small};
  border-radius: ${props => props.theme.radius.small};
  color: ${props => props.theme.colors.text};
  transition: all ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: ${props => props.theme.colors.hover};
  }
  
  &.delete:hover {
    color: ${props => props.theme.colors.error};
  }
  
  &.edit:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const Checkbox = styled.input`
  margin-right: ${props => props.theme.spacing.medium};
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
  accent-color: ${props => props.theme.colors.success};
`;

// TodoItem 組件
const TodoItem = ({ todo, dragHandleProps = {}, isDragging = false }) => {
  const { deleteTodo, toggleTodoCompleted, startEditing, isEditing, cancelEditing } = useTodoContext();
  
  const isEditingThis = isEditing === todo.id;
  // 格式化創建時間
  const formatDate = (dateString) => {
    try {
      // 使用改進的日期驗證
      if (!isValidDate(dateString)) {
        console.warn('Invalid date string:', dateString);
        return '日期格式錯誤';
      }
      
      const date = parseDate(dateString);
      if (!date) {
        return '日期格式錯誤';
      }
      
      return new Intl.DateTimeFormat('zh-TW', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Taipei'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return '日期格式錯誤';
    }
  };
  
  // 處理刪除確認
  const handleDelete = () => {
    if (window.confirm('確定要刪除這個待辦事項嗎？')) {
      deleteTodo(todo.id);
    }
  };
  
  if (isEditingThis) {
    return <TodoForm editTodo={todo} onCancel={cancelEditing} />;
  }
    return (
    <TodoItemContainer completed={todo.completed}>
      <Header completed={todo.completed}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodoCompleted(todo.id)}
          />
          <Title completed={todo.completed}>{todo.title}</Title>
        </div>
        <Controls>
          <DragHandle 
            {...dragHandleProps}
            style={{
              opacity: Object.keys(dragHandleProps).length > 0 ? 1 : 0.5,
              cursor: Object.keys(dragHandleProps).length > 0 ? 'grab' : 'not-allowed'
            }}
            title={Object.keys(dragHandleProps).length > 0 ? "拖拽排序" : "請在自定義排序模式下拖拽"}
          >
            ☰
          </DragHandle>
          <IconButton
            className="edit"
            onClick={() => startEditing(todo.id)}
            aria-label="編輯"
            title="編輯"
          >
            ✏️
          </IconButton>
          <IconButton
            className="delete"
            onClick={handleDelete}
            aria-label="刪除"
            title="刪除"
          >
            🗑️
          </IconButton>
        </Controls>
      </Header>
      
      {!todo.completed && todo.content && (
        <Content completed={todo.completed}>
          {todo.content}
        </Content>
      )}
        <Footer>
        <TagsContainer>
          {Array.isArray(todo.tags) && todo.tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </TagsContainer>
        <Date>{formatDate(todo.createdAt)}</Date>
      </Footer>
    </TodoItemContainer>
  );
};

export default TodoItem;

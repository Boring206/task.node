import React, { useState } from 'react';
import styled from '@emotion/styled';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTodoContext } from '../contexts/TodoContext';
import TodoItem from './TodoItem';

// 樣式組件
const Container = styled.div`
  padding: ${props => props.theme.spacing.medium};
`;

const FilterContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing.large};
  padding: ${props => props.theme.spacing.medium};
  background-color: ${props => props.theme.colors.backgroundSecondary};
  border-radius: ${props => props.theme.radius.medium};
  box-shadow: 0 2px 4px ${props => props.theme.colors.shadow};
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const FilterTitle = styled.h3`
  margin: 0;
  color: ${props => props.theme.colors.text};
`;

const FilterContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.small};
  margin-top: ${props => props.theme.spacing.small};
`;

const TagButton = styled.button`
  background-color: ${props => props.selected 
    ? props.theme.colors.primary 
    : props.theme.colors.tag};
  color: ${props => props.selected 
    ? 'white' 
    : props.theme.colors.tagText};
  border: none;
  border-radius: ${props => props.theme.radius.large};
  padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: ${props => props.selected 
      ? props.theme.colors.primary 
      : props.theme.colors.hover};
  }
`;

const SearchInput = styled.input`
  padding: ${props => props.theme.spacing.medium};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.medium};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  flex: 1;
  margin-right: ${props => props.theme.spacing.small};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.medium};
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const FilterSelect = styled.select`
  padding: ${props => props.theme.spacing.medium};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.medium};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xlarge};
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.large};
`;

const TodoListContainer = styled.div`
  margin-top: ${props => props.theme.spacing.large};
`;

// TodoList 組件
const TodoList = () => {
  const { todos, filterTodosByTags, getAllTags, reorderTodos } = useTodoContext();
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'completed'
  const [sortBy, setSortBy] = useState('createdAt'); // 'createdAt', 'title'

  // 獲取所有標籤
  const allTags = getAllTags();

  // 處理標籤選擇
  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // 清除所有過濾條件
  const clearFilters = () => {
    setSelectedTags([]);
    setSearchTerm('');
    setFilterStatus('all');
    setSortBy('createdAt');
  };

  // 過濾和排序待辦事項
  const filteredTodos = todos
    // 先按標籤過濾
    .filter(todo => {
      // 如果沒有選擇標籤，返回所有待辦事項
      if (selectedTags.length === 0) return true;
      // 否則，檢查待辦事項是否包含所有選定標籤
      return selectedTags.every(tag => todo.tags.includes(tag));
    })
    // 再按搜尋詞過濾
    .filter(todo => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        todo.title.toLowerCase().includes(term) ||
        (todo.content && todo.content.toLowerCase().includes(term)) ||
        todo.tags.some(tag => tag.toLowerCase().includes(term))
      );
    })
    // 最後按完成狀態過濾
    .filter(todo => {
      if (filterStatus === 'all') return true;
      return filterStatus === 'active' ? !todo.completed : todo.completed;
    })
    // 排序
    .sort((a, b) => {
      if (sortBy === 'createdAt') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      // 其他排序方式...
      return a.order - b.order;
    });

  // 處理拖放結束事件
  const handleDragEnd = (result) => {
    const { destination, source } = result;

    // 如果沒有目標位置或源位置和目標位置相同，則不做任何更改
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // 創建排序後的待辦事項列表副本
    const reorderedList = Array.from(filteredTodos);
    const [movedItem] = reorderedList.splice(source.index, 1);
    reorderedList.splice(destination.index, 0, movedItem);

    // 更新到全部待辦事項列表並保存到 localStorage
    const allUpdatedTodos = todos.map(todo => {
      const matchingReorderedTodo = reorderedList.find(t => t.id === todo.id);
      if (matchingReorderedTodo) {
        return {
          ...todo,
          order: reorderedList.findIndex(t => t.id === todo.id)
        };
      }
      return todo;
    });

    reorderTodos(allUpdatedTodos);
  };

  return (
    <Container>
      <FilterContainer>
        <FilterHeader>
          <FilterTitle>過濾與搜尋</FilterTitle>
          {(selectedTags.length > 0 || searchTerm || filterStatus !== 'all' || sortBy !== 'createdAt') && (
            <TagButton onClick={clearFilters}>清除過濾條件</TagButton>
          )}
        </FilterHeader>
        
        <SearchInput
          type="text"
          placeholder="搜尋待辦事項..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <FilterGroup>
          <FilterSelect
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">全部待辦</option>
            <option value="active">未完成</option>
            <option value="completed">已完成</option>
          </FilterSelect>
          
          <FilterSelect
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="createdAt">最新建立</option>
            <option value="title">按標題排序</option>
          </FilterSelect>
        </FilterGroup>
        
        {allTags.length > 0 && (
          <>
            <FilterTitle as="h4">按標籤過濾</FilterTitle>
            <FilterContent>
              {allTags.map(tag => (
                <TagButton
                  key={tag}
                  selected={selectedTags.includes(tag)}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag} {selectedTags.includes(tag) && '✓'}
                </TagButton>
              ))}
            </FilterContent>
          </>
        )}
      </FilterContainer>
      
      <TodoListContainer>
        {filteredTodos.length === 0 ? (
          <EmptyMessage>
            {selectedTags.length > 0 || searchTerm || filterStatus !== 'all'
              ? '沒有符合條件的待辦事項'
              : '尚未建立待辦事項'}
          </EmptyMessage>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="todos">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {filteredTodos.map((todo, index) => (
                    <Draggable key={todo.id} draggableId={todo.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            opacity: snapshot.isDragging ? 0.8 : 1
                          }}
                        >
                          <TodoItem todo={todo} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </TodoListContainer>
    </Container>
  );
};

export default TodoList;

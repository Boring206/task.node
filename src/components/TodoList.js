import React, { useState } from 'react';
import styled from '@emotion/styled';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from '@dnd-kit/modifiers';
import { useTodoContext } from '../contexts/TodoContext';
import SortableTodoItem from './SortableTodoItem';
import { parseDate } from '../utils/helpers';

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
  const { todos, getAllTags, reorderTodos } = useTodoContext();
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'completed'
  const [sortBy, setSortBy] = useState('order'); // 'createdAt', 'title', 'order'

  // 設置拖拽傳感器
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
    setSortBy('order');
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
      return filterStatus === 'active' ? !todo.completed : todo.completed;    })    // 排序
    .sort((a, b) => {
      if (sortBy === 'createdAt') {
        // 使用改進的日期比較
        const dateA = parseDate(a.createdAt);
        const dateB = parseDate(b.createdAt);
        
        // 如果任一日期無效，將其排到最後
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        
        return dateB - dateA; // 新的在前
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'order') {
        // 按order排序，如果沒有order屬性則使用創建時間
        const orderA = a.order !== undefined ? a.order : 999999;
        const orderB = b.order !== undefined ? b.order : 999999;
        return orderA - orderB;
      }
      // 默認按order排序
      return (a.order || 0) - (b.order || 0);
    });  // 處理拖拽結束事件
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeIndex = filteredTodos.findIndex(todo => todo.id === active.id);
    const overIndex = filteredTodos.findIndex(todo => todo.id === over.id);

    if (activeIndex !== overIndex) {
      // 創建新的排序後列表
      const reorderedList = arrayMove(filteredTodos, activeIndex, overIndex);
      
      // 為重新排序的項目分配新的order值
      // 我們需要確保所有項目都有正確的order值
      const updatedTodos = [...todos];
      
      // 更新被拖拽影響的所有項目的order
      reorderedList.forEach((todo, index) => {
        const todoIndex = updatedTodos.findIndex(t => t.id === todo.id);
        if (todoIndex !== -1) {
          updatedTodos[todoIndex] = {
            ...updatedTodos[todoIndex],
            order: index
          };
        }
      });

      console.log('拖拽重新排序:', { 
        activeIndex, 
        overIndex, 
        originalTodos: filteredTodos.map(t => ({ id: t.id, order: t.order })),
        reorderedTodos: reorderedList.map((t, i) => ({ id: t.id, order: i }))
      });
      
      reorderTodos(updatedTodos);
    }
  };

  return (
    <Container>
      <FilterContainer>
        <FilterHeader>
          <FilterTitle>過濾與搜尋</FilterTitle>        {(selectedTags.length > 0 || searchTerm || filterStatus !== 'all' || sortBy !== 'order') && (
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
            <option value="order">自定義排序</option>
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
        ) : (          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          >
            <SortableContext 
              items={filteredTodos.map(todo => todo.id)}
              strategy={verticalListSortingStrategy}
            >
              {filteredTodos.map((todo) => (
                <SortableTodoItem 
                  key={todo.id} 
                  todo={todo} 
                  disabled={sortBy !== 'order'}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </TodoListContainer>
    </Container>
  );
};

export default TodoList;

import { useState, useEffect } from 'react';
import useLocalStorage from './useLocalStorage';
import { generateId, createDateString, isValidDate } from '../utils/helpers';

// 管理待辦事項狀態和 CRUD 操作的 Hook
const useTodos = () => {
  // 使用 localStorage 存儲待辦事項
  const [todos, setTodos] = useLocalStorage('todosApp_todos', []);
  const [isEditing, setIsEditing] = useState(null);  // 數據修復：檢查並修復無效的日期格式和order屬性
  useEffect(() => {
    const fixInvalidDates = () => {
      let needsUpdate = false;
      const fixedTodos = todos.map((todo, index) => {
        let updatedTodo = { ...todo };
        
        // 修復無效日期
        if (!isValidDate(todo.createdAt)) {
          console.warn('修復無效日期:', todo.id, todo.createdAt);
          needsUpdate = true;
          updatedTodo.createdAt = createDateString();
        }
        
        // 確保每個todo都有order屬性
        if (updatedTodo.order === undefined || updatedTodo.order === null) {
          console.warn('添加缺失的order屬性:', todo.id);
          needsUpdate = true;
          updatedTodo.order = index;
        }
        
        return updatedTodo;
      });

      if (needsUpdate) {
        console.log('修復了數據不一致問題');
        setTodos(fixedTodos);
      }
    };

    if (todos.length > 0) {
      fixInvalidDates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 只在組件初始化時執行一次

  // 獲取所有待辦事項
  const getAllTodos = () => todos;
  // 新增待辦事項
  const addTodo = (todo) => {
    const newTodo = {
      id: generateId(),
      title: todo.title,
      content: todo.content || '',
      completed: false,
      createdAt: createDateString(),
      tags: todo.tags || [],
      order: todos.length // 新項目自動排到末尾
    };
    setTodos([...todos, newTodo]);
    return newTodo;
  };

  // 更新待辦事項
  const updateTodo = (id, updatedTodo) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, ...updatedTodo } : todo
    ));
  };

  // 刪除待辦事項
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // 切換待辦事項完成狀態
  const toggleTodoCompleted = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // 獲取單個待辦事項
  const getTodoById = (id) => {
    return todos.find(todo => todo.id === id);
  };

  // 按標籤過濾待辦事項
  const filterTodosByTags = (tags) => {
    if (!tags || tags.length === 0) return todos;
    return todos.filter(todo => 
      tags.every(tag => todo.tags && todo.tags.includes(tag))
    );
  };

  // 獲取所有唯一標籤
  const getAllTags = () => {
    const tagSet = new Set();
    todos.forEach(todo => {
      (todo.tags || []).forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  };
  // 更新待辦事項順序
  const reorderTodos = (reorderedTodos) => {
    console.log('reorderTodos called with:', reorderedTodos.map(t => ({ id: t.id, order: t.order, title: t.title })));
    
    // 確保所有項目都有有效的order屬性
    const todosWithValidOrder = reorderedTodos.map((todo, index) => {
      if (todo.order === undefined || todo.order === null) {
        return { ...todo, order: index };
      }
      return todo;
    });
    
    // 按order排序以確保一致性
    const sortedTodos = todosWithValidOrder.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    console.log('Setting todos to:', sortedTodos.map(t => ({ id: t.id, order: t.order, title: t.title })));
    setTodos(sortedTodos);
  };

  // 編輯狀態管理
  const startEditing = (id) => {
    setIsEditing(id);
  };

  const cancelEditing = () => {
    setIsEditing(null);
  };

  return {
    todos,
    isEditing,
    getAllTodos,
    getTodoById,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodoCompleted,
    filterTodosByTags,
    getAllTags,
    reorderTodos,
    startEditing,
    cancelEditing
  };
};

export default useTodos;

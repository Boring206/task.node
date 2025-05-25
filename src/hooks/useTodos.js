import { useState } from 'react';
import useLocalStorage from './useLocalStorage';
import { generateId } from '../utils/helpers';

// 管理待辦事項狀態和 CRUD 操作的 Hook
const useTodos = () => {
  // 使用 localStorage 存儲待辦事項
  const [todos, setTodos] = useLocalStorage('todosApp_todos', []);
  const [isEditing, setIsEditing] = useState(null);

  // 獲取所有待辦事項
  const getAllTodos = () => todos;

  // 新增待辦事項
  const addTodo = (todo) => {
    const newTodo = {
      id: generateId(),
      title: todo.title,
      content: todo.content || '',
      completed: false,
      createdAt: new Date().toISOString(),
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
    // 重新分配 order 屬性
    const todosWithNewOrder = reorderedTodos.map((todo, index) => ({
      ...todo,
      order: index
    }));
    setTodos(todosWithNewOrder);
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

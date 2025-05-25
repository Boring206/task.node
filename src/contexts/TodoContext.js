import React, { createContext, useContext } from 'react';
import useTodos from '../hooks/useTodos';

// 創建待辦事項上下文
const TodoContext = createContext();

// 創建提供者組件
export const TodoProvider = ({ children }) => {
  // 使用 useTodos 自定義 Hook 來管理待辦事項
  const todoMethods = useTodos();

  return (
    <TodoContext.Provider value={todoMethods}>
      {children}
    </TodoContext.Provider>
  );
};

// 自定義 Hook 以便於在組件中使用待辦事項功能
export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
};

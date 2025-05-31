import { useState, useEffect } from 'react';

// 封裝 localStorage 讀寫邏輯的 Hook
const useLocalStorage = (key, initialValue) => {  // 初始化狀態值
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // 嘗試從 localStorage 獲取值
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;
      
      // 嘗試解析 JSON
      const parsedValue = JSON.parse(item);
      
      // 如果是待辦事項數據，進行額外驗證
      if (key === 'todosApp_todos' && Array.isArray(parsedValue)) {
        // 驗證數據結構
        const validatedData = parsedValue.filter(todo => {
          return todo && 
                 typeof todo.id === 'string' && 
                 typeof todo.title === 'string' &&
                 typeof todo.completed === 'boolean';
        });
        
        if (validatedData.length !== parsedValue.length) {
          console.warn(`過濾了 ${parsedValue.length - validatedData.length} 個無效的待辦事項`);
        }
        
        return validatedData;
      }
      
      return parsedValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      // 如果發生錯誤，清除損壞的數據並返回初始值
      try {
        window.localStorage.removeItem(key);
      } catch (removeError) {
        console.error(`Error removing corrupted localStorage key "${key}":`, removeError);
      }
      return initialValue;
    }
  });
  // 定義 setValue 函數來更新 localStorage 的值以及 state
  const setValue = (value) => {
    try {
      // 允許值為函數（類似於 useState 的 setState 函數）
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // 驗證數據完整性
      if (key === 'todosApp_todos' && Array.isArray(valueToStore)) {
        // 確保每個待辦事項都有必要的字段
        const validatedTodos = valueToStore.map(todo => ({
          id: todo.id || Date.now().toString(),
          title: todo.title || '無標題',
          content: todo.content || '',
          completed: Boolean(todo.completed),
          createdAt: todo.createdAt || new Date().toISOString(),
          tags: Array.isArray(todo.tags) ? todo.tags : [],
          order: typeof todo.order === 'number' ? todo.order : 0
        }));
        
        // 更新 state
        setStoredValue(validatedTodos);
        // 儲存到 localStorage
        window.localStorage.setItem(key, JSON.stringify(validatedTodos));
      } else {
        // 更新 state
        setStoredValue(valueToStore);
        // 儲存到 localStorage
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      // 嘗試恢復到之前的狀態
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (recoveryError) {
        console.error(`Error recovering localStorage key "${key}":`, recoveryError);
      }
    }
  };

  useEffect(() => {
    // 添加儲存事件監聽器以處理跨窗口情況
    const handleStorageChange = (event) => {
      if (event.key === key && event.newValue) {
        setStoredValue(JSON.parse(event.newValue));
      }
    };

    // 註冊事件監聽器
    window.addEventListener('storage', handleStorageChange);

    // 清理函數
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
};

export default useLocalStorage;

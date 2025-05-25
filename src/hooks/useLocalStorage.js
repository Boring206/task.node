import { useState, useEffect } from 'react';

// 封裝 localStorage 讀寫邏輯的 Hook
const useLocalStorage = (key, initialValue) => {
  // 初始化狀態值
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // 嘗試從 localStorage 獲取值
      const item = window.localStorage.getItem(key);
      // 如果有值則解析 JSON，否則返回初始值
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      // 如果發生錯誤，返回初始值
      return initialValue;
    }
  });

  // 定義 setValue 函數來更新 localStorage 的值以及 state
  const setValue = (value) => {
    try {
      // 允許值為函數（類似於 useState 的 setState 函數）
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // 更新 state
      setStoredValue(valueToStore);
      // 儲存到 localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
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

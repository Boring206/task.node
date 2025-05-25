import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { themes } from '../styles/themes';
import { getTheme, saveTheme } from '../utils/helpers';

// 創建主題上下文
const ThemeContext = createContext();

// 創建一個提供者組件
export const ThemeProvider = ({ children }) => {
  // 從 localStorage 中獲取儲存的主題，如果沒有則默認為 'light'
  const [currentTheme, setCurrentTheme] = useState(() => getTheme());

  // 切換主題的函數
  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    saveTheme(newTheme);
  };

  // 當主題變化時執行副作用
  useEffect(() => {
    // 更新 body 的 data-theme 屬性以便於 CSS 選擇器使用
    document.body.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  // 提供主題相關數據和函數
  const themeContextValue = {
    currentTheme,
    theme: themes[currentTheme],
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <EmotionThemeProvider theme={themes[currentTheme]}>
        {children}
      </EmotionThemeProvider>
    </ThemeContext.Provider>
  );
};

// 創建一個自定義 Hook 以便於在組件中使用主題
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;

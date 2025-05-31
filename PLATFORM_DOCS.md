# 個人待辦事項系統

## 平台功能介紹

個人待辦事項系統是一個現代化的網頁應用程式，使用 React 技術打造，提供完整的待辦事項管理功能。系統具備響應式設計、多主題支援、拖拉排序以及本地存儲功能，無需任何後端伺服器即可完全運行。

## 系統架構圖

```
┌─────────────────────────────────────────────────────────────────┐
│                        個人待辦事項系統                           │
├─────────────────────────────────────────────────────────────────┤
│                         展示層 (UI Layer)                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   │
│  │   TodoList      │ │   TodoForm      │ │ ThemeSwitcher   │   │
│  │   組件          │ │   組件          │ │   組件          │   │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘   │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   │
│  │   TodoItem      │ │   Tag           │ │   TagInput      │   │
│  │   組件          │ │   組件          │ │   組件          │   │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                       狀態管理層 (State Layer)                   │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐ ┌─────────────────┐                       │
│  │  TodoContext    │ │ ThemeContext    │                       │
│  │  (待辦事項狀態)   │ │  (主題狀態)     │                       │
│  └─────────────────┘ └─────────────────┘                       │
├─────────────────────────────────────────────────────────────────┤
│                       自定義 Hooks 層                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐ ┌─────────────────┐                       │
│  │   useTodos      │ │ useLocalStorage │                       │
│  │   Hook          │ │   Hook          │                       │
│  └─────────────────┘ └─────────────────┘                       │
├─────────────────────────────────────────────────────────────────┤
│                       工具層 (Utils Layer)                      │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   │
│  │   helpers.js    │ │   themes.js     │ │ GlobalStyles.js │   │
│  │  (工具函數)      │ │  (主題定義)     │ │  (全域樣式)     │   │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                      資料持久化層                               │
├─────────────────────────────────────────────────────────────────┤
│                       ┌─────────────────┐                       │
│                       │  localStorage   │                       │
│                       │    (瀏覽器)     │                       │
│                       └─────────────────┘                       │
└─────────────────────────────────────────────────────────────────┘
```

## 核心功能特性

### 1. 待辦事項管理
- **新增待辦**: 支援標題、內容描述和標籤分類
- **編輯修改**: 即時編輯任何待辦事項內容
- **完成標記**: 點擊勾選框標記完成狀態
- **刪除功能**: 安全刪除確認機制
- **拖拉排序**: 使用 react-beautiful-dnd 實現直觀的拖拉重新排序

### 2. 標籤系統
- **動態標籤**: 輸入時自動建議已存在標籤
- **標籤過濾**: 支援多標籤組合過濾
- **標籤管理**: 新增、刪除、重複使用標籤

### 3. 搜尋與過濾
- **全文搜尋**: 搜尋標題、內容和標籤
- **狀態過濾**: 按完成狀態篩選 (全部/未完成/已完成)
- **排序功能**: 按建立時間或標題排序
- **清除過濾**: 一鍵清除所有過濾條件

### 4. 主題系統
- **明暗主題**: 內建淺色和深色主題
- **即時切換**: 無縫切換主題樣式
- **自動記憶**: 本地儲存使用者主題偏好

### 5. 響應式設計
- **跨裝置支援**: 完美支援桌面、平板、手機
- **現代化 UI**: 使用 Emotion 打造美觀介面
- **無障礙設計**: 良好的鍵盤導航和螢幕閱讀器支援

## 技術架構詳解

### 前端框架與套件

#### React 19.1.0
- **函數組件**: 全面使用現代 React Hooks 模式
- **組件化架構**: 高度模組化的組件設計
- **性能優化**: 使用 React.StrictMode 確保程式碼品質

#### 樣式管理
```javascript
// 使用 Emotion 套件進行 CSS-in-JS 樣式管理
import styled from '@emotion/styled';
import { Global, css } from '@emotion/react';

// 主題化設計
const themes = {
  light: { colors: {...}, typography: {...} },
  dark: { colors: {...}, typography: {...} }
};
```

#### UI 套件
- **@emotion/react** & **@emotion/styled**: CSS-in-JS 樣式解決方案
- **react-beautiful-dnd**: 拖拉排序功能實現
- **React Context API**: 狀態管理和主題提供

### 自定義 Hooks 架構

#### 1. useTodos Hook
```javascript
const useTodos = () => {
  const [todos, setTodos] = useLocalStorage('todosApp_todos', []);
  
  // CRUD 操作
  const addTodo = (todo) => { /* 新增邏輯 */ };
  const updateTodo = (id, updatedTodo) => { /* 更新邏輯 */ };
  const deleteTodo = (id) => { /* 刪除邏輯 */ };
  const toggleTodoCompleted = (id) => { /* 切換完成狀態 */ };
  
  // 進階功能
  const filterTodosByTags = (tags) => { /* 標籤過濾 */ };
  const getAllTags = () => { /* 獲取所有標籤 */ };
  const reorderTodos = (reorderedTodos) => { /* 重新排序 */ };
  
  return { todos, addTodo, updateTodo, ... };
};
```

#### 2. useLocalStorage Hook
```javascript
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    // 從 localStorage 讀取初始值
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  const setValue = (value) => {
    // 同時更新 state 和 localStorage
    setStoredValue(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue];
};
```

### Context 狀態管理

#### TodoContext
```javascript
export const TodoProvider = ({ children }) => {
  const todoMethods = useTodos();
  
  return (
    <TodoContext.Provider value={todoMethods}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
};
```

#### ThemeContext
```javascript
export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => getTheme());
  
  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    saveTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, theme: themes[currentTheme], toggleTheme }}>
      <EmotionThemeProvider theme={themes[currentTheme]}>
        {children}
      </EmotionThemeProvider>
    </ThemeContext.Provider>
  );
};
```

## 組件架構說明

### 1. App.js (根組件)
- **提供者包裝**: 使用 ThemeProvider 和 TodoProvider 包裝整個應用
- **頁籤切換**: 管理「待辦清單」和「新增待辦」頁籤
- **佈局結構**: 定義應用的整體佈局和樣式

### 2. TodoList.js (清單組件)
- **過濾系統**: 實現搜尋、標籤過濾、狀態過濾
- **拖拉排序**: 整合 react-beautiful-dnd 實現排序功能
- **清單渲染**: 動態渲染 TodoItem 組件列表

### 3. TodoForm.js (表單組件)
- **表單驗證**: 實現必填欄位驗證和錯誤提示
- **標籤管理**: 動態新增、刪除、建議標籤功能
- **雙模式**: 支援新增和編輯兩種模式

### 4. TodoItem.js (項目組件)
- **狀態展示**: 根據完成狀態調整視覺樣式
- **即時編輯**: 點擊編輯按鈕切換到編輯模式
- **互動功能**: 完成勾選、刪除確認

### 5. 輔助組件
- **ThemeSwitcher**: 主題切換開關
- **Tag**: 可重用的標籤顯示組件
- **TagInput**: 標籤輸入管理組件

## 本地儲存機制

### localStorage 實現
```javascript
// 儲存策略
const STORAGE_KEYS = {
  TODOS: 'todosApp_todos',
  THEME: 'todosApp_theme'
};

// 自動同步
useEffect(() => {
  const handleStorageChange = (event) => {
    if (event.key === key && event.newValue) {
      setStoredValue(JSON.parse(event.newValue));
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, [key]);
```

### 資料結構
```javascript
// 待辦事項資料結構
{
  id: "1640123456789",
  title: "完成專案文件",
  content: "撰寫詳細的技術文件和使用說明",
  completed: false,
  createdAt: "2024-01-15T10:30:00.000Z",
  tags: ["工作", "文件", "重要"],
  order: 0
}

// 主題設定
{
  currentTheme: "dark" | "light"
}
```

## 套件依賴分析

### 生產依賴
```json
{
  "@emotion/react": "^11.14.0",        // CSS-in-JS 核心
  "@emotion/styled": "^11.14.0",       // 樣式組件
  "react": "^19.1.0",                  // React 框架
  "react-dom": "^19.1.0",              // React DOM 渲染
  "react-beautiful-dnd": "^13.1.1",    // 拖拉排序
  "react-scripts": "5.0.1",            // Create React App 腳本
  "web-vitals": "^2.1.4"               // 性能監控
}
```

### 開發依賴
```json
{
  "@emotion/babel-plugin": "^11.13.5",  // Emotion Babel 插件
  "customize-cra": "^1.0.0",            // CRA 客製化
  "react-app-rewired": "^2.2.1"         // 重寫 CRA 配置
}
```

### 測試依賴
```json
{
  "@testing-library/dom": "^10.4.0",       // DOM 測試工具
  "@testing-library/jest-dom": "^6.6.3",   // Jest DOM 匹配器
  "@testing-library/react": "^16.3.0",     // React 測試工具
  "@testing-library/user-event": "^13.5.0" // 使用者事件模擬
}
```

## 開發與部署

### 本地開發
```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm start

# 執行測試
npm test

# 建置生產版本
npm run build
```

### 建置配置
```javascript
// config-overrides.js
const { override, addBabelPlugins } = require('customize-cra');

module.exports = override(
  addBabelPlugins('@emotion/babel-plugin')
);
```

## 性能優化策略

### 1. 組件優化
- **React.memo**: 防止不必要的重新渲染
- **useCallback**: 快取事件處理函數
- **useMemo**: 快取複雜計算結果

### 2. 狀態管理優化
- **Context 分離**: 將 Todo 和 Theme 狀態分開管理
- **本地狀態**: 組件內部狀態避免不必要的全域狀態

### 3. 效能監控
- **Web Vitals**: 整合 Core Web Vitals 監控
- **性能測量**: 使用 React DevTools Profiler

## 安全性考量

### 1. XSS 防護
- **React 內建保護**: JSX 自動轉義用戶輸入
- **DOMPurify**: 如需插入 HTML 時的清理

### 2. 資料驗證
- **前端驗證**: 表單輸入驗證和錯誤處理
- **型別檢查**: 使用 PropTypes 或 TypeScript

### 3. 本地儲存安全
- **資料加密**: 敏感資料可考慮加密存儲
- **大小限制**: 監控 localStorage 使用量

## 維護與擴展

### 程式碼組織
```
src/
├── components/          # 可重用組件
├── contexts/           # React Context 提供者
├── hooks/              # 自定義 Hooks
├── styles/             # 樣式和主題
├── utils/              # 工具函數
└── App.js              # 主應用組件
```

### 未來擴展方向
1. **雲端同步**: 整合 Firebase 或其他雲端服務
2. **多使用者**: 增加使用者認證和權限管理
3. **離線支援**: 實現 Service Worker 離線功能
4. **推播通知**: 增加到期提醒功能
5. **資料匯出**: 支援 JSON/CSV 格式匯出
6. **進階篩選**: 增加日期範圍、優先級篩選
7. **統計圖表**: 增加任務完成統計視覺化

## 開發指南

### 新增組件範例
```javascript
import React from 'react';
import styled from '@emotion/styled';

const ComponentContainer = styled.div`
  // 使用主題變數
  padding: ${props => props.theme.spacing.medium};
  background: ${props => props.theme.colors.background};
`;

const MyComponent = () => {
  return (
    <ComponentContainer>
      {/* 組件內容 */}
    </ComponentContainer>
  );
};

export default MyComponent;
```

### 使用 Context
```javascript
import { useTodoContext } from '../contexts/TodoContext';
import { useTheme } from '../contexts/ThemeContext';

const MyComponent = () => {
  const { todos, addTodo } = useTodoContext();
  const { theme, toggleTheme } = useTheme();
  
  // 組件邏輯
};
```

本系統展示了現代 React 應用開發的最佳實踐，包括函數組件、Hooks、Context API、CSS-in-JS 以及本地狀態管理等核心概念的實際運用。

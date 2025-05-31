// 工具函數
export const generateId = () => Date.now().toString();

// 建立標準化的日期字符串
export const createDateString = () => {
  try {
    return new Date().toISOString();
  } catch (error) {
    console.error('Error creating date string:', error);
    // 使用備用方法
    return new Date(Date.now()).toISOString();
  }
};

// 驗證日期字符串是否有效
export const isValidDate = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

// 安全的日期解析
export const parseDate = (dateString) => {
  try {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString);
      return null;
    }
    return date;
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
};

// 儲存待辦事項到 localStorage
export const saveTodos = (todos) => {
  localStorage.setItem('todosApp_todos', JSON.stringify(todos));
};

// 從 localStorage 獲取待辦事項
export const getTodos = () => {
  const todos = localStorage.getItem('todosApp_todos');
  return todos ? JSON.parse(todos) : [];
};

// 儲存主題設定到 localStorage
export const saveTheme = (theme) => {
  localStorage.setItem('todosApp_theme', theme);
};

// 從 localStorage 獲取主題設定
export const getTheme = () => {
  return localStorage.getItem('todosApp_theme') || 'light';
};

// 唯一標籤列表
export const getUniqueTags = (todos) => {
  const tagSet = new Set();
  todos.forEach(todo => {
    (todo.tags || []).forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet);
};

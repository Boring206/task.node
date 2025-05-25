// 工具函數
export const generateId = () => Date.now().toString();

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

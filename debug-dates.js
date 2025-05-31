// 日期測試工具
// 在瀏覽器控制台中運行以測試日期功能

// 測試日期創建
console.log('測試日期創建:');
console.log('當前時間 ISO:', new Date().toISOString());

// 測試無效日期
const invalidDates = [
  undefined,
  null,
  '',
  'invalid-date',
  'NaN',
  '2024-13-45',  // 無效的月份和日期
  '2024/01/01',  // 錯誤格式
  123456789,     // 數字而非字符串
];

console.log('\n測試無效日期格式:');
invalidDates.forEach(dateStr => {
  const date = new Date(dateStr);
  const isValid = !isNaN(date.getTime());
  console.log(`"${dateStr}" -> ${isValid ? '有效' : '無效'} (${date})`);
});

// 測試有效日期
const validDates = [
  '2024-01-15T10:30:00.000Z',
  '2024-05-31T08:11:11.648Z',
  new Date().toISOString(),
];

console.log('\n測試有效日期格式:');
validDates.forEach(dateStr => {
  const date = new Date(dateStr);
  const formatted = new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Taipei'
  }).format(date);
  console.log(`"${dateStr}" -> "${formatted}"`);
});

// 模擬損壞的 localStorage 數據
const corruptedTodos = [
  {
    id: '1',
    title: '測試項目 1',
    completed: false,
    createdAt: 'invalid-date',
    tags: [],
    order: 0
  },
  {
    id: '2', 
    title: '測試項目 2',
    completed: false,
    createdAt: null,
    tags: [],
    order: 1
  },
  {
    id: '3',
    title: '測試項目 3',
    completed: false,
    createdAt: '2024-01-15T10:30:00.000Z',
    tags: [],
    order: 2
  }
];

console.log('\n測試損壞的數據修復:');
console.log('原始數據:', corruptedTodos);

// 模擬修復過程
const fixedTodos = corruptedTodos.map(todo => {
  const date = new Date(todo.createdAt);
  if (isNaN(date.getTime())) {
    console.log(`修復項目 ${todo.id} 的無效日期: ${todo.createdAt}`);
    return {
      ...todo,
      createdAt: new Date().toISOString()
    };
  }
  return todo;
});

console.log('修復後數據:', fixedTodos);

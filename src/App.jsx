import { useState, useEffect } from 'react';

function App() {
  // 1. Инициализация состояния с проверкой localStorage
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Сохранение задач в localStorage при каждом изменении массива tasks
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Добавление задачи
  const addTask = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTask = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      createdAt: new Date().toLocaleDateString('ru-RU'),
    };

    setTasks([...tasks, newTask]);
    setInputValue('');
  };

  // Отметить как выполненную
  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Очистка выполненных
  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  // Фильтрация задач для поиска
  const filteredTasks = tasks.filter(task => 
    task.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Менеджер задач</h1>
      
      {/* Форма добавления */}
      <form onSubmit={addTask} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Новая задача..."
          style={{ flexGrow: 1, padding: '8px' }}
        />
        <button type="submit">Добавить</button>
      </form>

      {/* Поиск */}
      <input 
        type="text" 
        placeholder="Поиск по задачам..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ width: '100%', marginBottom: '15px', padding: '8px', boxSizing: 'border-box' }}
      />

      {/* Статистика */}
      <div style={{ marginBottom: '15px', fontSize: '14px', color: 'gray' }}>
        Всего: {tasks.length} | 
        Активных: {tasks.filter(t => !t.completed).length} | 
        Выполнено: {tasks.filter(t => t.completed).length}
      </div>

      {/* Список задач */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredTasks.map(task => (
          <li key={task.id} style={{ 
            border: '1px solid #ccc', 
            padding: '10px', 
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={() => toggleTask(task.id)} 
                style={{ cursor: 'pointer' }}
              />
              <span style={{ 
                marginLeft: '10px',
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'gray' : 'black'
              }}>
                {task.text}
              </span>
            </div>
            <small style={{ color: 'gray' }}>{task.createdAt}</small>
          </li>
        ))}
      </ul>

      {/* Кнопка очистки */}
      {tasks.some(t => t.completed) && (
        <button 
          onClick={clearCompleted} 
          style={{ marginTop: '20px', background: '#ff4d4d', color: 'white', border: 'none', padding: '10px', cursor: 'pointer' }}
        >
          Удалить выполненные
        </button>
      )}
    </div>
  );
}

export default App;
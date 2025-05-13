import { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error('API取得失敗:', error));
  }, []);

  const handleAddTask = () => {
    if (inputText.trim() === '') return;

    fetch('http://localhost:8000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: inputText }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks([...tasks, data]);
        setInputText('');
      })
      .catch((err) => console.error('タスク追加失敗:', err));
  };

  const handleUpdateTask = (task, index) => {
    if (editText.trim() === '') return;

    fetch(`http://localhost:8000/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editText, completed: task.completed }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        const newTasks = [...tasks];
        newTasks[index].title = updatedTask.title;
        setTasks(newTasks);
        setEditingIndex(null);
        setEditText('');
      });
  };

  const handleToggleComplete = (task, index) => {
    fetch(`http://localhost:8000/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: task.title, completed: !task.completed }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        const newTasks = [...tasks];
        newTasks[index] = updatedTask;
        setTasks(newTasks);
      })
      .catch((err) => console.error('完了状態の更新失敗:', err));
  };

  const handleDeleteTask = (taskId, index) => {
    fetch(`http://localhost:8000/api/tasks/${taskId}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error('削除失敗');
        const newTasks = [...tasks];
        newTasks.splice(index, 1);
        setTasks(newTasks);
      })
      .catch((err) => console.error('削除エラー:', err));
  };

  return (
    <div className='min-h-screen bg-gray-50 py-10 px-4 text-gray-800 font-sans'>
  <div className='max-w-xl mx-auto'>
    <h1 className='text-3xl font-bold text-center mb-8'>ToDoアプリ</h1>
    
        <div className='flex items-center gap-2'>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="タスクを入力"
            className='flex-1 border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
          />
          <button 
          onClick={handleAddTask}
          className='bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md transition'
          >
            追加
          </button>
        </div>

        <ul>
          {tasks.map((task, index) => (
            <li
            key={task.id}
            className='bg-white shadow p-4 rounded-md flex justify-between items-center'
            >
              {editingIndex === index ? (
                <div>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button onClick={() => handleUpdateTask(task, index)}>保存</button>
                </div>
              ) : (
                <>
                  <div>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task, index)}
                    />
                    <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                      {task.title}
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        setEditingIndex(index);
                        setEditText(task.title);
                      }}
                    >
                      編集
                    </button>
                    <button onClick={() => handleDeleteTask(task.id, index)}>削除</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

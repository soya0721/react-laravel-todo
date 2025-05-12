import { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');

  // ✅ 最初の1回だけLaravelからタスク一覧を取得
  useEffect(() => {
    fetch('http://localhost:8000/api/tasks')
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
      })

      .catch((error) => {
        console.error('API取得失敗:', error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-lg">
      <h1 className="text-2xl font-bold mb-4">ToDo一覧</h1>

      {/* 入力欄と追加ボタン */}
      <div className="mb-4">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="border rounded px-2 py-1 mr-2"
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          onClick={() => {
            if (inputText.trim() === '') return;

            fetch('http://localhost:8000/api/tasks', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ title: inputText }),
            })
              .then((res) => res.json())
              .then((data => {
                setTasks([...tasks, data]);
                setInputText('');
              }))
              .catch((err) => {
                console.error('タスク追加失敗:', err);
              });
          }}
        >
          タスクを追加
        </button>
      </div>

      {/* タスクリスト表示 */}
      <ul className="list-disc list-inside">
        {tasks.map((task, index) => (
          <li key={task.id} className="flex items-center justify-between mb-2">
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="border px-1 py-0.5 mr-2"
                />
                <button
                  className="text-sm bg-green-500 text-white px-2 py-1 rounded"
                  onClick={() => {
                    if (editText.trim() === '') return;

                    fetch(`http://localhost:8000/api/tasks/${task.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ 
                        title: editText,
                        completed: task.completed
                      }),
                    })
                      .then((res) => res.json())
                      .then((updatedTask) => {
                        const newTasks = [...tasks];
                        newTasks[index].title = updatedTask.title;
                        setTasks(newTasks);
                        setEditingIndex(null);
                        setEditText('');
                      });
                  }}
                >
                  保存
                </button>

              </>
            ) : (
              <>
                <div className='flex items-center'>
                <input 
                type="checkbox"
                checked={task.completed}
                onChange={() => {
                  fetch(`http://localhost:8000/api/tasks/${task.id}`, {
                    method: 'PUT',
                    headers: {'Content-Type' : 'application/json'},
                    body: JSON.stringify({
                      title: task.title,
                      completed: !task.completed,
                    }),
                  })
                  .then((res) => res.json())
                  .then((updatedTask) => {
                    const newTasks = [...tasks];
                    newTasks[index] = updatedTask;
                    setTasks(newTasks);
                })
                .catch((err) => {
                  console.error('完了状態の更新失敗:', err);
                });
                }}
                className='mr-2'
                />
                <span className={task.completed ?'line-through text-gray-500' : ''}>
                {task.title}
                </span>
                </div>
                <button
                  className='ml-4 text-sm bg-yellow-500 text-white px-2 py-1 rounded'
                  onClick={() => {
                    setEditingIndex(index);
                    setEditText(task.title)
                  }}
                >
                  編集
                </button>
                <button
                  className="ml-2 text-sm bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => {
                    fetch(`http://localhost:8000/api/tasks/${task.id}`, {
                      method: 'DELETE',
                    })
                      .then((res) => {
                        if (!res.ok) throw new Error('削除失敗');
                        // 表示からも削除（indexを使って取り除く）
                        const newTasks = [...tasks];
                        newTasks.splice(index, 1); // index番目の要素を削除
                        setTasks(newTasks);
                      })
                      .catch((err) => {
                        console.error('削除エラー:', err);
                      });
                  }}
                >
                  削除
                </button>
              </>

            )}
          </li>
        ))}
      </ul>

    </div>
  );
}

export default App;
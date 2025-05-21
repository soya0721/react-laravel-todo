import { useState, useEffect } from "react";
import TaskItem from "./components/TaskItem";
import AddButton from "./components/AddButton"
import TaskInput from "./components/TaskInput";

function App() {
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [showIncompleteOnly, setShowIncompleteOnly] = useState(false);
  const [inputBody, setInputBody] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        console.log("APIから取得したtasks", data);
        setTasks(data);
      })
      .catch((error) => console.error("API取得失敗:", error));
  }, []);

  const handleAddTask = () => {
    if (inputText.trim() === "") return;
    console.log("送信内容:", { title: inputText, body: inputBody });
    fetch("http://localhost:8000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: inputText, body: inputBody }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks([...tasks, data]);
        setInputText("");
        setInputBody("");
      })
      .catch((err) => console.error("タスク追加失敗:", err));
  };

  const handleUpdateTask = (task, index) => {
    if (editText.trim() === "") return;

    fetch(`http://localhost:8000/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editText, completed: task.completed }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        const newTasks = [...tasks];
        newTasks[index].title = updatedTask.title;
        setTasks(newTasks);
        setEditingIndex(null);
        setEditText("");
      });
  };

  const handleToggleComplete = (task, index) => {
    fetch(`http://localhost:8000/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: task.title, completed: !task.completed }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        const newTasks = [...tasks];
        newTasks[index] = updatedTask;
        setTasks(newTasks);
      })
      .catch((err) => console.error("完了状態の更新失敗:", err));
  };

  const handleDeleteTask = (taskId, index) => {
    fetch(`http://localhost:8000/api/tasks/${taskId}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("削除失敗");
        const newTasks = [...tasks];
        newTasks.splice(index, 1);
        setTasks(newTasks);
      })
      .catch((err) => console.error("削除エラー:", err));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 text-gray-800 font-sans">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">📋 ToDoアプリ</h1>

        <TaskInput 
          inputText={inputText}
          setInputText={setInputText}
          inputBody={inputBody}
          setInputBody={setInputBody}
          onClick={ handleAddTask }
        />

        <div className="text-right mb-4">
          <button
            onClick={() => setShowIncompleteOnly(!showIncompleteOnly)}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all shadow
          ${
            showIncompleteOnly
              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }
          `}
          >
            {showIncompleteOnly ? "🌱 すべて表示" : "✅ 未完了だけ"}
          </button>
        </div>
          
        <ul className="space-y-4">
          {tasks
            .filter((task) => !showIncompleteOnly || !task.completed)
            .map((task, index) => (
              <li
                key={task.id}
                className="bg-white shadow p-4 rounded-md flex justify-between items-center"
              >
                {editingIndex === index ? (
                  <div className="flex-1 flex gap-2 items-center">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none"
                    />
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      onClick={() => handleUpdateTask(task, index)}
                    >
                      保存
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center flex-1 gap-2">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleComplete(task, index)}
                        className="accent-blue-500 w-5 h-5"
                      />
                      <div className="flex flex-col">
                        <span
                          className={`text-lg ${
                            task.completed ? "line-through text-gray-400" : ""
                          }`}
                        >
                          {task.title}
                        </span>
                        {task.body && (
                          <span className="text-sm text-gray-500 mt-1 block">
                            {task.body}
                          </span>
                        )}
                      </div>

                      {task.completed && (
                        <span className="ml-2 text-green-500 text-sm">
                          🌟よくできました！
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                        onClick={() => {
                          setEditingIndex(index);
                          setEditText(task.title);
                        }}
                      >
                        編集
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        onClick={() => handleDeleteTask(task.id, index)}
                      >
                        削除
                      </button>
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

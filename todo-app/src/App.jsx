import { useState, useEffect } from "react";
// import TaskItem from "./components/TaskItem";
import TaskInput from "./components/TaskInput";
import ToggleFilterButton from "./components/ToggleFilterButton";
import TaskItem from "./components/TaskItem";

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
          onClick={handleAddTask}
        />

        <ToggleFilterButton
          showIncompleteOnly={showIncompleteOnly}
          toggleShowIncompleteOnly={() =>
            setShowIncompleteOnly(!showIncompleteOnly)
          }
        />

        <ul className="space-y-4">
          {tasks
            .filter((task) => !showIncompleteOnly || !task.completed)
            .map((task, index) => (
              <TaskItem
                key={task.id}
                task={task}
                index={index}
                editingIndex={editingIndex}
                editText={editText}
                setEditText={setEditText}
                setEditingIndex={setEditingIndex}
                handleUpdateTask={handleUpdateTask}
                handleToggleComplete={handleToggleComplete}
                handleDeleteTask={handleDeleteTask}
              />
            ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

import React from "react";

const TaskItem = ({
  task,
  index,
  editingIndex,
  editText,
  setEditText,
  setEditingIndex,
  handleUpdateTask,
  handleToggleComplete,
  handleDeleteTask,
  editBody,
  setEditBody
}) => {
  return (
    <li
      className="bg-white shadow p-4 rounded-md flex justify-between items-center"
    >
      {editingIndex === index ? (
        <div className="flex-1 flex flex-col gap-2">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none"
          />
          <textarea
          value={editBody}
          onChange={(e) => setEditBody(e.target.value)}
          className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none resize-none"
  placeholder="詳細を書く"
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
                setEditBody(task.body || "");
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
  );
};

export default TaskItem;

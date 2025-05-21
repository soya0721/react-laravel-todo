import React from "react";

function TaskInput ({ inputText, setInputText, inputBody, setInputBody, onClick }) {
  return (
    <div className="flex items-center mb-4 gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="タスクを入力"
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            value={inputBody}
            onChange={(e) => setInputBody(e.target.value)}
            placeholder="メモを入力（任意）"
            className="w-full mt-2 border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md transition"
            onClick={onClick}
          >
            追加
          </button>
        </div>
  );
}
export default TaskInput;
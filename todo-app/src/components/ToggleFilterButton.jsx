import React from "react";

function ToggleFilterButton({ showIncompleteOnly, toggleShowIncompleteOnly }) {
  return (
    <div className="text-right mb-4">
      <button
        onClick={toggleShowIncompleteOnly}
        className={`px-4 py-2 rounded-full font-semibold text-sm transition-all shadow
        ${
          showIncompleteOnly
            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        {showIncompleteOnly ? "🌱 すべて表示" : "✅ 未完了だけ"}
      </button>
    </div>
  );
}

export default ToggleFilterButton;
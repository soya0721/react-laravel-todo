function AddButton({ onClick }) {
  return(
    <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md transition"
            onClick={onClick}
          >
            追加
          </button>
  );
}

export default AddButton;
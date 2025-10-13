import "./App.css";

function App() {
  return (
    <div className="bg-blue-400 h-full flex flex-col">
      <h1 className="heroText text-orange-600 text-9xl font-extralight">
        DevLog
      </h1>
      <button
        type="button"
        className="text-red-200 text-2xl border-1 rounded-4xl mx-5 py-7 hover:brightness-115 hover:scale-101 hover:transition-all duration-200 ease-in-out"
        onClick={newNote}
      >
        new note
      </button>
    </div>
  );
}

function newNote() {
  console.log("New Note")
}

export default App;

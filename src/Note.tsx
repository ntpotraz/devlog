function Note({ body, time }: { body: string; time: Date }) {
  return (
    <li className="bg-gray-600 border border-orange-500 rounded-lg p-4 my-4">
      <h2 className="text-gray-400 text-sm">
        {time.toLocaleDateString()} {time.toLocaleTimeString()}
      </h2>
      <p className="text-gray-200 mt-2 font-sans whitespace-pre-wrap text-left">{body}</p>
    </li>
  );
}

export default Note;

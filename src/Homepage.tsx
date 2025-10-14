import Note from "./Note";

type HomepageProps = {
  notes: { body: string; time: Date }[];
};

function Homepage({ notes }: HomepageProps) {
  return (
    <div className="flex flex-col items-center">
      {notes.length === 0 ? (
        <p className="text-gray-400">No notes available</p>
      ) : (
        <ul className="w-full">
          {notes.map(({ body, time }) => (
            <Note key={time.getMilliseconds()} body={body} time={time} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default Homepage;

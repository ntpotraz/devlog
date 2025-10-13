import Note from "./Note";

type HomepageProps = {
  notes: { body: string; time: Date }[];
};

function Homepage({ notes }: HomepageProps) {
  return (
    <div>
      {notes.length === 0 ? (
        <p>No notes available</p>
      ) : (
        <ul>
          {notes.map(({body, time}) => (
            <Note body={body} time={time} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default Homepage;

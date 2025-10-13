function Note({ body, time }: {body: string, time: Date}) {
  return (
    <div className="my-5 bg-green-400">
      <h2>{time.toLocaleDateString()} {time.toLocaleTimeString()}</h2>
      <p>{body}</p>
    </div>
  );
}

export default Note;

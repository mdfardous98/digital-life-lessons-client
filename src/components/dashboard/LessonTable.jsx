const LessonTable = ({ lessons, onDelete, onFeature }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Creator</th>
          <th>Visibility</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {lessons.map((lesson) => (
          <tr key={lesson._id}>
            <td>{lesson.title}</td>
            <td>{lesson.author.displayName}</td>
            <td>{lesson.visibility}</td>
            <td>
              <button
                onClick={() => onFeature(lesson._id)}
                className="btn btn-sm btn-success"
              >
                Feature
              </button>
              <button
                onClick={() => onDelete(lesson._id)}
                className="btn btn-sm btn-error"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default LessonTable;

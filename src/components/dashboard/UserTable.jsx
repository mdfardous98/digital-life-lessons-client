const UserTable = ({ users, onUpdateRole, onDelete }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id}>
            <td>{user.displayName}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
              <button
                onClick={() => onUpdateRole(user._id, "admin")}
                className="btn btn-sm btn-primary"
              >
                Make Admin
              </button>
              <button
                onClick={() => onDelete(user._id)}
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
export default UserTable;

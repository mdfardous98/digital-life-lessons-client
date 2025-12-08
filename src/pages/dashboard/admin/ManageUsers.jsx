import UserTable from "../../../components/dashboard/UserTable";
import useLessons from "../../../hooks/useLessons";
const ManageUsers = () => {
  const { data: users, loading } = useLessons("/api/admin/users");

  if (loading) return <Loader />;

  const updateRole = (id, role) => {
    console.log(id, role);
    // API call to update role
  };

  const deleteUser = (id) => {
    console.log(id);
    // API call to delete
  };

  return (
    <UserTable users={users} onUpdateRole={updateRole} onDelete={deleteUser} />
  );
};

export default ManageUsers;

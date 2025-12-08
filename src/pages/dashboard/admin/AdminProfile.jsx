import { useAuth } from "../../../contexts/AuthContext";

const AdminProfile = () => {
  const { currentUser } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Profile</h1>
      <div className="card bg-base-100 shadow-xl p-6">
        <img src={currentUser.photoURL} className="w-32 rounded-full mx-auto" />
        <h2 className="text-2xl font-bold text-center mt-4">
          {currentUser.displayName}
        </h2>
        <p className="text-center">{currentUser.email}</p>
        <p className="text-center badge badge-primary mt-2">Admin</p>
      </div>
    </div>
  );
};

export default AdminProfile;

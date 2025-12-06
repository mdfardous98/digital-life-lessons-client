import { useAuth } from "../../../contexts/AuthContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function UserDropdown() {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            src={
              currentUser.photoURL || "https://ui-avatars.com/api/?name=User"
            }
            alt="User"
          />
        </div>
      </label>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li className="font-bold">{currentUser.displayName}</li>
        <li>
          <Link to="/dashboard/profile">Profile</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <a onClick={handleLogout}>Logout</a>
        </li>
      </ul>
    </div>
  );
}

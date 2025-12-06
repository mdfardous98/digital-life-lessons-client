import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export default function MobileMenu() {
  const { currentUser, isPremium } = useAuth();

  return (
    <div className="dropdown">
      <label tabIndex={0} className="btn btn-ghost lg:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h8m-8 6h16"
          />
        </svg>
      </label>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content mt-3 `z-1` p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li>
          <Link to="/">Home</Link>
        </li>
        {currentUser && (
          <li>
            <Link to="/dashboard/add-lesson">Add Lesson</Link>
          </li>
        )}
        {currentUser && (
          <li>
            <Link to="/dashboard/my-lessons">My Lessons</Link>
          </li>
        )}
        <li>
          <Link to="/public-lessons">Public Lessons</Link>
        </li>
        {currentUser && !isPremium && (
          <li>
            <Link to="/pricing">Upgrade</Link>
          </li>
        )}
        {!currentUser && (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
        {!currentUser && (
          <li>
            <Link to="/register">Signup</Link>
          </li>
        )}
      </ul>
    </div>
  );
}

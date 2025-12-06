import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useTheme } from "../../../contexts/ThemeContext";
import UserDropdown from "./UserDropdown";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const { currentUser, isPremium } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="navbar bg-base-100 shadow-lg fixed top-0 z-50">
      <div className="navbar-start">
        <MobileMenu />
        <Link
          to="/"
          className="btn btn-ghost normal-case text-2xl font-bold text-gradient-to-r from-indigo-600 to-purple-600"
        >
          Digital Life Lessons
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
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
        </ul>
      </div>
      <div className="navbar-end gap-2">
        {currentUser ? (
          <>
            {isPremium && (
              <span className="badge badge-primary">Premium ⭐</span>
            )}
            <UserDropdown />
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Signup
            </Link>
          </>
        )}
        <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </div>
  );
}

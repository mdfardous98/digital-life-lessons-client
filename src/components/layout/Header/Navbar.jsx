import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo.png"; 

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setShowDropdown(false);
  };

  const handleAddLesson = () => {
    if (!isLoggedIn) return navigate("/login");
    navigate("/dashboard/add-lesson");
  };

  const handleMyLessons = () => {
    if (!isLoggedIn) return navigate("/login");
    navigate("/dashboard/my-lessons");
  };

  // Toggle light/dark mode
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Apply theme 
  useEffect(() => {
    document.body.className = isDarkMode ? "dark-mode" : "light-mode";
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <header className="header container">
      <div className="navbar ">
        {/* Logo*/}
        <div className="nav-brand ">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="nav-links">
          <Link to="/">Home</Link>

          <button className="nav-link-btn" onClick={handleAddLesson}>
            Add Lesson
          </button>

          <button className="nav-link-btn" onClick={handleMyLessons}>
            My Lessons
          </button>

          <Link to="/public-lessons">Public Lessons</Link>

          <Link
            to={isLoggedIn ? "/pricing" : "/login"}
            className="upgrade-link"
          >
            {user?.subscription === "premium" ? "Premium ⭐" : "Upgrade"}
          </Link>

          {/* Light/Dark Toggle */}
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {isDarkMode ? "🌞 Light" : "🌙 Dark"}
          </button>
        </nav>

        {/* Auth Section */}
        <div className="nav-auth">
          {isLoggedIn ? (
            <div className="user-dropdown-container">
              <button
                className="user-avatar-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="user-avatar"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {user?.displayName?.charAt(0) || "U"}
                  </div>
                )}
              </button>

              {showDropdown && (
                <>
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <p className="user-name">{user?.displayName || "User"}</p>
                      <p className="user-email">{user?.email}</p>
                    </div>

                    <div className="dropdown-divider"></div>

                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      👤 Profile
                    </Link>

                    <Link
                      to="/dashboard"
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      📊 Dashboard
                    </Link>

                    <div className="dropdown-divider"></div>

                    <button
                      onClick={handleLogout}
                      className="dropdown-item logout-item"
                    >
                      🚪 Logout
                    </button>
                  </div>

                  <div
                    className="dropdown-backdrop"
                    onClick={() => setShowDropdown(false)}
                  />
                </>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">
                Login
              </Link>
              <Link to="/signup" className="signup-btn">
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

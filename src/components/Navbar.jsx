import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FaBook,
  FaSun,
  FaMoon,
  FaBars,
  FaSignOutAlt,
  FaCrown,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import logo from "../assets/logo.png";
const Navbar = () => {
  const { user, logout, isPremium } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const avatarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  //  avatar dropdown
  useEffect(() => {
    const handler = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setIsAvatarOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Nav config
  const navLinks = [
    { path: "/", label: "Home", protected: false },
    { path: "/dashboard/add-lesson", label: "Add Lesson", protected: true },
    { path: "/dashboard/my-lessons", label: "My Lessons", protected: true },
    { path: "/public-lessons", label: "Public Lessons", protected: false },
    { path: "/pricing", label: "Pricing", protected: true },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (link) => {
    if (link.protected && !user) {
      navigate("/login", { state: { from: link.path } });
    } else {
      navigate(link.path);
    }
    setIsOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-40 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden transform hover:scale-110 transition-transform duration-300">
              <img
                src={logo}
                alt="Digital Life Lessons"
                className="w-full h-full object-cover"
              />
            </div>

            <span className="text-xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
              Digital Life Lessons
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavClick(link)}
                className={`px-3 py-2 rounded-md font-medium transition-all duration-300 focus:outline-none ${
                  isActive(link.path)
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md font-semibold transform scale-105"
                    : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-300"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Premium badge (if premium) */}
            {user && isPremium && (
              <div
                title="Premium member"
                className="hidden sm:inline-flex items-center space-x-2 bg-amber-400 text-gray-900 px-3 py-1 rounded-full font-semibold"
              >
                <FaCrown className="text-sm" />
                <span className="text-sm">Premium</span>
              </div>
            )}

            {/* theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-transform duration-300 transform hover:scale-110"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <FaMoon size={18} /> : <FaSun size={18} />}
            </button>

            {/* Auth  */}
            {user ? (
              <div className="relative" ref={avatarRef}>
                <button
                  onClick={() => setIsAvatarOpen((v) => !v)}
                  className="inline-flex items-center space-x-2 focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded={isAvatarOpen}
                  title={user.displayName || "User"}
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "avatar"}
                      className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-800 dark:text-gray-100">
                      {(user.displayName || "U").charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </button>

                {isAvatarOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-2 z-50"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {user.displayName || "User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>

                    {/* Profile*/}
                    <button
                      onClick={() => {
                        navigate("/dashboard/profile");
                        setIsAvatarOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-primary-600  dark:text-badge-premium hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Profile
                    </button>

                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        setIsAvatarOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-primary-600 dark:text-badge-premium  hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Dashboard
                    </button>

                    <button
                      onClick={async () => {
                        await logout();
                        setIsAvatarOpen(false);
                        navigate("/");
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50"
                    >
                      <span className="inline-flex items-center">
                        <FaSignOutAlt className="mr-2" /> Log out
                      </span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden md:inline-flex text-indigo-600 dark:text-indigo-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-all duration-300 transform hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="hidden md:inline-flex bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
                >
                  Register
                </Link>
              </>
            )}

            {/* mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden transition-transform duration-300 transform hover:scale-110"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <FaBars size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-all duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavClick(link)}
                className={`block w-full text-left text-base font-medium transition-all duration-300 px-3 py-2 rounded-md ${
                  isActive(link.path)
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md transform scale-105"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {link.label}
              </button>
            ))}

            {user ? (
              <>
                <button
                  onClick={() => {
                    navigate("/dashboard");
                    setIsOpen(false);
                  }}
                  className="block w-full text-left text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md"
                >
                  Dashboard
                </button>
                <button
                  onClick={async () => {
                    await logout();
                    setIsOpen(false);
                    navigate("/");
                  }}
                  className="flex items-center w-full text-left text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 px-3 py-2 rounded-md"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block text-base font-medium bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-2 rounded-md"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

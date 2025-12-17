import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaCog,
  FaMoon,
  FaSun,
  FaSignOutAlt,
} from "react-icons/fa";

function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newMode);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className="bg-gray-100 dark:bg-gray-800 p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">
        Cybersecurity Analyst Dashboard
      </h1>
      <div className="relative" ref={dropdownRef}>
        <FaUserCircle
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="text-3xl text-gray-800 dark:text-white cursor-pointer"
        />
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded shadow-lg z-50">
            <button
              className="flex items-center w-full px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                navigate("/profile");
                setDropdownOpen(false);
              }}
            >
              <FaUserCircle className="mr-2" /> View Profile
            </button>

            <button
              className="flex items-center w-full px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                navigate("/settings");
                setDropdownOpen(false);
              }}
            >
              <FaCog className="mr-2" /> Settings
            </button>

            <button
              onClick={toggleDarkMode}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? <FaSun className="mr-2" /> : <FaMoon className="mr-2" />}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;










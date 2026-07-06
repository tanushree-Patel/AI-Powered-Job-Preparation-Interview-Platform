import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import useTheme from "../hooks/useTheme"
import '../../../style/navbar.scss'

const Navbar = ({ user, handleLogout }) => {
  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const userInitial = user?.username?.[0]?.toUpperCase() || "U";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const handleAction = async (path) => {
    setDropdownOpen(false);

    await handleLogout();

    navigate(path);
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-logo">
          Interview <span className="highlight">AI</span>
        </Link>

        <Link to="/downloads" className="nav-link-btn">
          Downloads
        </Link>
      </div>

      <div className="nav-right">
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
        >
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>

        <div
          className="user-profile-container"
          ref={dropdownRef}
        >
          <button
            className="avatar-btn"
            onClick={() =>
              setDropdownOpen((prev) => !prev)
            }
          >
            {userInitial}
          </button>

          {dropdownOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <div className="dropdown-username">
                  {user?.username}
                </div>

                <div className="dropdown-email">
                  {user?.email}
                </div>
              </div>

              <button
                className="dropdown-item"
                onClick={() =>
                  handleAction("/register")
                }
              >
                Create New Account
              </button>

              <button
                className="dropdown-item"
                onClick={() =>
                  handleAction("/login")
                }
              >
                Login to Another Account
              </button>

              <hr />

              <button
                className="dropdown-item signout-btn"
                onClick={() =>
                  handleAction("/login")
                }
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
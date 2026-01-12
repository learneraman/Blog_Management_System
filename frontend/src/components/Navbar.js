import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import "../App.css";

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand" onClick={() => setIsMenuOpen(false)}>
          📝 AMAN's BlogHub
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          <Link 
            to="/blogs" 
            className={isActive("/blogs") ? "nav-link-active" : ""}
            onClick={() => setIsMenuOpen(false)}
          >
            ✍️ Blogs
          </Link>
          {isLoggedIn ? (
            <>
              <Link 
                to="/dashboard" 
                className={isActive("/dashboard") ? "nav-link-active" : ""}
                onClick={() => setIsMenuOpen(false)}
              >
                📊 Dashboard
              </Link>
              <button 
                onClick={handleLogout} 
                className="btn btn-primary btn-sm"
                title="Logout"
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={isActive("/login") ? "nav-link-active" : ""}
                onClick={() => setIsMenuOpen(false)}
              >
                🔑 Login
              </Link>
              <Link 
                to="/register" 
                className={isActive("/register") ? "nav-link-active" : ""}
                onClick={() => setIsMenuOpen(false)}
              >
                🆕 Register
              </Link>
            </>
          )}
          <button 
            onClick={toggleTheme} 
            className="theme-toggle"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <SunIcon className="icon" />
            ) : (
              <MoonIcon className="icon" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

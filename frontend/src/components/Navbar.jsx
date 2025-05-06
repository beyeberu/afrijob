import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import './Navbar.css';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="AfriJob Logo" className="logo-img" />
          <span>AfriJob</span>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `navbar-link ${isActive ? 'active' : ''}`
              }
              end
            >
              Home
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink 
              to="/jobs" 
              className={({ isActive }) => 
                `navbar-link ${isActive ? 'active' : ''}`
              }
            >
              Jobs
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                `navbar-link ${isActive ? 'active' : ''}`
              }
            >
              About
            </NavLink>
          </li>

          <li className="navbar-item">
            <NavLink 
              to="/contact" 
              className={({ isActive }) => 
                `navbar-link ${isActive ? 'active' : ''}`
              }
            >
              Contact
            </NavLink>
          </li>
          {currentUser && (
            <li className="navbar-item">
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => 
                  `navbar-link ${isActive ? 'active' : ''}`
                }
              >
                Dashboard
              </NavLink>
            </li>
          )}
        </ul>

        <div className="navbar-actions">
          {currentUser ? (
            <button onClick={handleLogout} className="navbar-button">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="navbar-button">
                Login
              </Link>
              <Link to="/signup" className="navbar-button primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
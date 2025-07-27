import { Link, NavLink } from 'react-router-dom';
import { useState, useRef } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import './Navbar.css';
import logo from '../assets/logo.png';
import defaultAvatar from '../assets/image.png';

const texts = {
  en: {
    afrijob: "afrijob",
    home: "Home",
    jobs: "Jobs",
    about: "About",
    contact: "Contact",
    // dashboard: "Dashboard",
    login: "Login",
    register: "Register",
    logout: "Logout"
  },
  am: {
    afrijob: "አፍሪጆብ",
    home: "መነሻ",
    jobs: "ስራዎች",
    about: "ስለ እኛ",
    contact: "አግኙን",
    // dashboard: "ዳሽቦርድ",
    login: "ግባ",
    register: "ይመዝገቡ",
    logout: "ውጣ"
  }
};

const Navbar = ({ lang, setLang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const { currentUser } = useAuth();
  const fileInputRef = useRef();

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

  // Handle profile photo upload
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUser) return;

    try {
      const storage = getStorage();
      const storageRef = ref(storage, `profile_photos/${currentUser.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);

      await updateProfile(auth.currentUser, { photoURL });
      window.location.reload(); // Refresh to show new photo
    } catch (error) {
      alert("Failed to update profile photo.");
      console.error(error);
    }
  };

  console.log('Navbar lang:', lang);

  return (
    <nav className="navbar">
      <div
        className="navbar-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {/* Left: Logo */}
        <div style={{ flex: "0 0 auto" }}>
          <Link to="/" className="navbar-logo" style={{ display: "flex", alignItems: "center" }}>
            <img src={logo} alt="AfriJob Logo" className="logo-img" />
            <span>{texts[lang].afrijob}</span>
          </Link>
        </div>

        {/* Center: Nav links */}
        <ul
          className={`navbar-menu ${isOpen ? 'active' : ''}`}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: "1 1 auto",
            gap: "2rem",
            margin: 0,
            padding: 0,
            listStyle: "none"
          }}
        >
          <li className="navbar-item">
            <NavLink to="/" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} end>
              {texts[lang].home}
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/jobs" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
              {texts[lang].jobs}
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/about" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
              {texts[lang].about}
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/contact" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
              {texts[lang].contact}
            </NavLink>
          </li>
          {/* {currentUser && (
            <li className="navbar-item">
              <NavLink to="/dashboard" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                {texts[lang].dashboard}
              </NavLink>
            </li>
          )} */}
        </ul>

        {/* Right: Account/Profile or Login/Register */}
        <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center" }}>
          <select
            value={lang}
            onChange={e => setLang(e.target.value)}
            style={{ marginRight: "1rem", padding: "0.2rem 0.5rem", borderRadius: "4px" }}
          >
            <option value="en">English</option>
            <option value="am">አማርኛ</option>
          </select>
          {currentUser ? (
            <div className="account-dropdown" style={{ position: "relative", marginLeft: "1rem" }}>
              <button
                className="navbar-link"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
                onClick={() => setShowAccount((prev) => !prev)}
              >
                <img
                  src={currentUser.photoURL || defaultAvatar}
                  alt="Profile"
                  className="profile-avatar small"
                />
                
              </button>
              {showAccount && (
                <div
                  className="account-menu"
                  style={{
                    position: "absolute",
                    top: "2.5rem",
                    right: 0,
                    background: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    minWidth: "220px",
                    zIndex: 100
                  }}
                  onMouseLeave={() => setShowAccount(false)}
                >
                  <div style={{ padding: "1rem", borderBottom: "1px solid #eee", color: "#333", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <img
                      src={currentUser.photoURL || defaultAvatar}
                      alt="Profile"
                      className="profile-avatar"
                    />
                    <strong>{currentUser.email}</strong>
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      background: "#e53935",
                      color: "#fff",
                      border: "none",
                      borderRadius: "0 0 6px 6px",
                      cursor: "pointer",
                      fontWeight: 500
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar-actions" style={{ marginLeft: "1rem" }}>
              <Link to="/login" className="navbar-button">
                Login
              </Link>
              <Link to="/signup" className="navbar-button primary">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
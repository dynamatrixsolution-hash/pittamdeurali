import React, { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import api from '../services/api';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [hotelName, setHotelName] = useState('Sanctum Retreat');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.success && res.data) {
          setHotelName(res.data.hotelName);
        }
      } catch (err) {
        console.error('Navbar settings loading error:', err);
      }
    };
    fetchSettings();
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-luxury sticky-top">
      <div className="container">
        <NavLink className="navbar-brand font-serif fw-bold fs-4 text-decoration-none" to="/" onClick={closeMenu} style={{ color: 'var(--color-gold)' }}>
          {hotelName}
        </NavLink>
        
        <button 
          className="navbar-toggler border-0 shadow-none" 
          type="button" 
          onClick={() => setIsOpen(!isOpen)}
          aria-controls="navbarNav" 
          aria-expanded={isOpen} 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link nav-link-luxury ${isActive ? 'active' : ''}`} to="/" onClick={closeMenu}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link nav-link-luxury ${isActive ? 'active' : ''}`} to="/about" onClick={closeMenu}>
                About Us
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link nav-link-luxury ${isActive ? 'active' : ''}`} to="/rooms" onClick={closeMenu}>
                Rooms
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link nav-link-luxury ${isActive ? 'active' : ''}`} to="/gallery" onClick={closeMenu}>
                Gallery
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link nav-link-luxury ${isActive ? 'active' : ''}`} to="/services" onClick={closeMenu}>
                Services
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link nav-link-luxury ${isActive ? 'active' : ''}`} to="/experiences" onClick={closeMenu}>
                Experiences
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link nav-link-luxury ${isActive ? 'active' : ''}`} to="/blog" onClick={closeMenu}>
                Blog
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link nav-link-luxury ${isActive ? 'active' : ''}`} to="/contact" onClick={closeMenu}>
                Contact Us
              </NavLink>
            </li>
            
            {/* Theme Toggle Button */}
            <li className="nav-item ms-lg-3 my-2 my-lg-0">
              <button 
                className="theme-toggle-btn" 
                onClick={toggleTheme}
                title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <i className="bi bi-sun"></i> : <i className="bi bi-moon-stars-fill"></i>}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

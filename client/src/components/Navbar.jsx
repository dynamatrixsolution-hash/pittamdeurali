import React, { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import api from '../services/api';
import ReviewModal from './ReviewModal';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [hotelName, setHotelName] = useState('Sanctum Retreat');
  const [isOpen, setIsOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

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
    <nav className={`navbar navbar-expand-lg navbar-luxury sticky-top ${isDarkMode ? 'navbar-dark' : 'navbar-light'}`}>
      <div className="container">
        <NavLink className="navbar-brand font-serif fw-bold fs-4 text-decoration-none d-flex align-items-center" to="/" onClick={closeMenu} style={{ color: 'var(--color-gold)' }}>
          <img 
            src="/logo.png" 
            alt="New Pittam Deurali Logo" 
            style={{ height: '44px', width: 'auto', objectFit: 'contain' }} 
          />
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
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link nav-link-luxury ${isActive ? 'active' : ''}`} to="/rooms" onClick={closeMenu}>
                Accommodation
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link nav-link-luxury ${isActive ? 'active' : ''}`} to="/restaurant" onClick={closeMenu}>
                Restaurant
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link nav-link-luxury ${isActive ? 'active' : ''}`} to="/gallery" onClick={closeMenu}>
                Gallery
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link nav-link-luxury ${isActive ? 'active' : ''}`} to="/treks" onClick={closeMenu}>
                Popular Treks
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link nav-link-luxury ${isActive ? 'active' : ''}`} to="/contact" onClick={closeMenu}>
                Contact
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
            
            {/* Booking CTA Button */}
            <li className="nav-item ms-lg-3 my-2 my-lg-0 d-flex align-items-center">
              <NavLink 
                className="btn btn-sm btn-primary fw-bold px-3 py-2" 
                to="/booking" 
                onClick={closeMenu}
              >
                Book Now
              </NavLink>
            </li>
            
            {/* Review Button */}
            <li className="nav-item ms-lg-3 my-2 my-lg-0 d-flex align-items-center">
              <button 
                className="btn btn-sm btn-outline-orange" 
                onClick={() => { setIsReviewModalOpen(true); closeMenu(); }}
              >
                Leave a Review
              </button>
            </li>
          </ul>
        </div>
      </div>
      
      <ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} />
    </nav>
  );
};

export default Navbar;

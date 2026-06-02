import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Footer = () => {
  const [settings, setSettings] = useState({
    hotelName: '',
    address: 'Pittam Deurali, Lumle 33700, Kaski, Nepal',
    phone: '+977-9801234567',
    email: 'stay@newpittamdeurali.com',
    facebookUrl: '#',
    instagramUrl: '#',
    tripAdvisorUrl: '#',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.success && res.data) {
          setSettings(res.data);
        }
      } catch (err) {
        console.error('Footer settings loading error:', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)' }} className="py-5">
      <div className="container">
        <div className="row g-4">
          {/* Logo & Description */}
          <div className="col-lg-5 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <img
                src="/logo.png"
                alt="New Pittam Deurali Logo"
                style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
              />
              <h5 className="font-serif fw-bold m-0" style={{ color: 'var(--color-gold)' }}>
                {settings.hotelName}
              </h5>
            </div>
            <p className="small lh-lg" style={{ maxWidth: '380px' }}>
              Enjoy comfortable accommodation, delicious local cuisine, and beautiful surroundings with genuine family-operated Nepali hospitality. Located at the scenic ridge-top of Pitam Deurali.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="fs-5" style={{ color: 'var(--text-primary)' }}>
                <i className="bi bi-facebook"></i>
              </a>
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="fs-5" style={{ color: 'var(--text-primary)' }}>
                <i className="bi bi-instagram"></i>
              </a>
              <a href={settings.tripAdvisorUrl} target="_blank" rel="noopener noreferrer" className="fs-5" style={{ color: 'var(--text-primary)' }}>
                <i className="bi bi-award-fill"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-uppercase fw-bold small mb-3" style={{ letterSpacing: '0.1em', color: 'var(--text-primary)' }}>
              Discover
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/rooms" className="text-decoration-none text-reset hover-gold">Rooms & Lodging</Link></li>
              <li><Link to="/restaurant" className="text-decoration-none text-reset hover-gold">Restaurant & Dining</Link></li>
              <li><Link to="/treks" className="text-decoration-none text-reset hover-gold">Popular Treks</Link></li>
              <li><Link to="/gallery" className="text-decoration-none text-reset hover-gold">Photo Gallery</Link></li>
              <li><Link to="/contact" className="text-decoration-none text-reset hover-gold">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-lg-4 col-md-6">
            <h6 className="text-uppercase fw-bold small mb-3" style={{ letterSpacing: '0.1em', color: 'var(--text-primary)' }}>
              Reservations & Location
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <i className="bi bi-geo-alt-fill me-2" style={{ color: 'var(--color-gold)' }}></i>
                {settings.address}
              </li>
              <li>
                <i className="bi bi-telephone-fill me-2" style={{ color: 'var(--color-gold)' }}></i>
                {settings.phone}
              </li>
              <li>
                <i className="bi bi-envelope-fill me-2" style={{ color: 'var(--color-gold)' }}></i>
                {settings.email}
              </li>
              <li className="mt-2">
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Pitam+Deurali+Guest+House+and+Restaurant+Lumle+Nepal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-orange btn-sm py-1 px-3 text-white text-decoration-none"
                  style={{ fontSize: '0.75rem' }}
                >
                  <i className="bi bi-map-fill me-1"></i> Get Directions
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4" style={{ borderColor: 'var(--border-color)' }} />

        <div className="row small">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} {settings.hotelName}. All Rights Reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end mt-2 mt-md-0">
            <p className="mb-0">
              Family-Run Guest House & Restaurant &bull; Pitam Deurali, Nepal
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

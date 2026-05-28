import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingManager from './BookingManager';
import CmsRooms from './CmsRooms';
import CmsGallery from './CmsGallery';
import CmsHomepage from './CmsHomepage';
import CmsSettings from './CmsSettings';
import { ThemeContext } from '../../context/ThemeContext';
import api from '../../services/api';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalInquiries: 0,
    unreadInquiries: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [adminName, setAdminName] = useState('Property Manager');
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const adminUser = localStorage.getItem('adminUser');
    if (adminUser) {
      try {
        const parsed = JSON.parse(adminUser);
        setAdminName(parsed.name || parsed.username || 'Manager');
      } catch (err) {
        console.error('Error parsing admin user details:', err);
      }
    }

    const fetchStats = async () => {
      try {
        const [bookingsRes, inquiriesRes] = await Promise.all([
          api.get('/bookings'),
          api.get('/inquiries')
        ]);

        if (bookingsRes.success && inquiriesRes.success) {
          const totalB = bookingsRes.data.length;
          const pendingB = bookingsRes.data.filter(b => b.status === 'Pending').length;
          const confirmedB = bookingsRes.data.filter(b => b.status === 'Confirmed').length;
          
          const totalI = inquiriesRes.data.length;
          const unreadI = inquiriesRes.data.filter(i => i.status === 'Unread').length;

          setStats({
            totalBookings: totalB,
            pendingBookings: pendingB,
            confirmedBookings: confirmedB,
            totalInquiries: totalI,
            unreadInquiries: unreadI
          });
        }
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };
    
    fetchStats();
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    // REDIRECT TO HOME PAGE /
    navigate('/');
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false); // Close mobile sidebar on select
  };

  return (
    <div className="admin-layout">
      {/* Mobile Toggle Button */}
      <button 
        className="admin-mobile-toggle" 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        title="Toggle Sidebar"
        aria-label="Toggle Navigation Sidebar"
      >
        {isSidebarOpen ? <i className="bi bi-x-lg"></i> : <i className="bi bi-list"></i>}
      </button>

      {/* Fixed Left Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'show' : ''}`}>
        <div>
          <div className="px-4 mb-4 admin-sidebar-brand">
            <h4 className="font-serif fw-bold m-0" style={{ color: 'var(--color-gold)' }}>Sanctum</h4>
            <span className="small text-muted text-uppercase tracking-wider" style={{ fontSize: '0.65rem' }}>Management Console</span>
          </div>

          <nav className="d-flex flex-column gap-1">
            <button 
              className={`admin-sidebar-link btn border-0 rounded-0 text-start w-100 ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => handleTabClick('overview')}
            >
              <i className="bi bi-speedometer2"></i> Dashboard Overview
            </button>
            <button 
              className={`admin-sidebar-link btn border-0 rounded-0 text-start w-100 ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => handleTabClick('bookings')}
            >
              <i className="bi bi-calendar2-check"></i> Bookings & Inquiries
            </button>
            <button 
              className={`admin-sidebar-link btn border-0 rounded-0 text-start w-100 ${activeTab === 'rooms' ? 'active' : ''}`}
              onClick={() => handleTabClick('rooms')}
            >
              <i className="bi bi-door-open"></i> Rooms CMS
            </button>
            <button 
              className={`admin-sidebar-link btn border-0 rounded-0 text-start w-100 ${activeTab === 'gallery' ? 'active' : ''}`}
              onClick={() => handleTabClick('gallery')}
            >
              <i className="bi bi-images"></i> Gallery CMS
            </button>
            <button 
              className={`admin-sidebar-link btn border-0 rounded-0 text-start w-100 ${activeTab === 'homepage' ? 'active' : ''}`}
              onClick={() => handleTabClick('homepage')}
            >
              <i className="bi bi-layout-text-window-reverse"></i> Homepage CMS
            </button>
            <button 
              className={`admin-sidebar-link btn border-0 rounded-0 text-start w-100 ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => handleTabClick('settings')}
            >
              <i className="bi bi-gear"></i> Global Settings
            </button>
          </nav>
        </div>

        <div className="px-4 admin-sidebar-footer">
          <button
            className="btn btn-sm w-100 admin-theme-toggle mb-2"
            onClick={toggleTheme}
            title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            <i className={`bi ${isDarkMode ? 'bi-sun' : 'bi-moon-stars-fill'} me-2`}></i>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <div className="small text-muted mb-2 text-truncate" style={{ fontSize: '0.75rem' }}>Manager: <strong>{adminName}</strong></div>
          <button className="btn btn-sm btn-outline-danger w-100 rounded-0 text-uppercase py-2" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }} onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i> Log Out
          </button>
        </div>
      </aside>

      {/* Scrollable Content Area */}
      <main className="admin-content">
        {activeTab === 'overview' && (
          <div className="fade-in-up">
            <h3 className="font-serif fw-bold mb-2">Welcome Back, {adminName}</h3>
            <p className="text-secondary small mb-5">Retreat property logistics and pending reservation actions.</p>
            
            {/* Stats Cards */}
            <div className="row g-4 mb-5">
              <div className="col-lg-3 col-md-6">
                <div className="card-luxury p-4 admin-stat-card h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="small text-uppercase tracking-wider text-muted" style={{ fontSize: '0.7rem' }}>Total Bookings</span>
                    <i className="bi bi-calendar-event fs-4" style={{ color: 'var(--color-gold)' }}></i>
                  </div>
                  <h2 className="fw-bold mb-0">{loadingStats ? '...' : stats.totalBookings}</h2>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="card-luxury p-4 admin-stat-card h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="small text-uppercase tracking-wider text-muted" style={{ fontSize: '0.7rem' }}>Pending Audits</span>
                    <i className="bi bi-hourglass-split fs-4 text-warning"></i>
                  </div>
                  <h2 className="fw-bold mb-0">{loadingStats ? '...' : stats.pendingBookings}</h2>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="card-luxury p-4 admin-stat-card h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="small text-uppercase tracking-wider text-muted" style={{ fontSize: '0.7rem' }}>Confirmed Guests</span>
                    <i className="bi bi-check-circle-fill fs-4 text-success"></i>
                  </div>
                  <h2 className="fw-bold mb-0">{loadingStats ? '...' : stats.confirmedBookings}</h2>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="card-luxury p-4 admin-stat-card h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="small text-uppercase tracking-wider text-muted" style={{ fontSize: '0.7rem' }}>Unread Messages</span>
                    <i className="bi bi-envelope-exclamation fs-4 text-info"></i>
                  </div>
                  <h2 className="fw-bold mb-0">{loadingStats ? '...' : stats.unreadInquiries}</h2>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="p-4 admin-quick-actions" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
              <h5 className="font-serif fw-bold mb-3" style={{ color: 'var(--color-gold)' }}>Quick Actions</h5>
              <div className="d-flex flex-wrap gap-2">
                <button className="btn btn-luxury" onClick={() => setActiveTab('bookings')}>Review Inquiries</button>
                <button className="btn btn-luxury-outline" onClick={() => setActiveTab('rooms')}>Add Room Variant</button>
                <button className="btn btn-luxury-outline" onClick={() => setActiveTab('gallery')}>Upload Image Asset</button>
                <button className="btn btn-luxury-outline" onClick={() => setActiveTab('homepage')}>Change Landing Page Hero</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && <BookingManager />}
        {activeTab === 'rooms' && <CmsRooms />}
        {activeTab === 'gallery' && <CmsGallery />}
        {activeTab === 'homepage' && <CmsHomepage />}
        {activeTab === 'settings' && <CmsSettings />}
      </main>
    </div>
  );
};

export default Dashboard;

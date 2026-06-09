import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingManager from './BookingManager';
import CmsRooms from './CmsRooms';
import CmsGallery from './CmsGallery';
import CmsHomepage from './CmsHomepage';
import CmsSettings from './CmsSettings';
import CmsRestaurantMenu from './CmsRestaurantMenu';
import CmsRestaurantInfo from './CmsRestaurantInfo';
import CmsReviews from './CmsReviews';
import CmsTreks from './CmsTreks';
import CmsPanoramas from './CmsPanoramas';
import CmsAbout from './CmsAbout';
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
    unreadInquiries: 0,
    totalReviews: 0,
    pendingReviews: 0,
    approvedReviews: 0,
    averageRating: '0.0'
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
        const [bookingsRes, inquiriesRes, reviewsRes] = await Promise.all([
          api.get('/bookings'),
          api.get('/inquiries'),
          api.get('/reviews')
        ]);

        if (bookingsRes.success && inquiriesRes.success && reviewsRes.success) {
          const totalB = bookingsRes.data.length;
          const pendingB = bookingsRes.data.filter(b => b.status === 'Pending').length;
          const confirmedB = bookingsRes.data.filter(b => b.status === 'Confirmed').length;
          
          const totalI = inquiriesRes.data.length;
          const unreadI = inquiriesRes.data.filter(i => i.status === 'Unread').length;

          const totalRev = reviewsRes.data.length;
          const pendingRev = reviewsRes.data.filter(r => r.status === 'Pending').length;
          const approvedRev = reviewsRes.data.filter(r => r.status === 'Approved').length;
          
          const sumRatings = reviewsRes.data.reduce((sum, r) => sum + r.rating, 0);
          const avgRating = totalRev > 0 ? (sumRatings / totalRev).toFixed(1) : '0.0';

          setStats({
            totalBookings: totalB,
            pendingBookings: pendingB,
            confirmedBookings: confirmedB,
            totalInquiries: totalI,
            unreadInquiries: unreadI,
            totalReviews: totalRev,
            pendingReviews: pendingRev,
            approvedReviews: approvedRev,
            averageRating: avgRating
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
      {/* Mobile Top Navbar */}
      <header className="admin-mobile-header">
        <div className="d-flex align-items-center gap-2">
          <img 
            src="/logo.png" 
            alt="New Pittam Deurali Logo" 
            style={{ height: '28px', width: 'auto', objectFit: 'contain' }} 
          />
          <h5 className="font-serif fw-bold m-0" style={{ color: 'var(--color-gold)', fontSize: '0.95rem' }}>Deurali CMS</h5>
        </div>
        <button 
          className="admin-menu-toggle-btn btn border-0 p-1" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {isSidebarOpen ? <i className="bi bi-x-lg fs-4"></i> : <i className="bi bi-list fs-4"></i>}
        </button>
      </header>

      {/* Sidebar Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="admin-sidebar-backdrop" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Fixed Left Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'show' : ''}`}>
        <div className="px-4 mb-4 admin-sidebar-brand d-flex align-items-center gap-2">
          <img 
            src="/logo.png" 
            alt="New Pittam Deurali Logo" 
            style={{ height: '32px', width: 'auto', objectFit: 'contain' }} 
          />
          <div>
            <h4 className="font-serif fw-bold m-0" style={{ color: 'var(--color-gold)', fontSize: '1.15rem' }}>Deurali CMS</h4>
            <span className="small text-muted text-uppercase tracking-wider" style={{ fontSize: '0.65rem', display: 'block' }}>Console</span>
          </div>
        </div>

        <div className="admin-sidebar-nav">
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
              className={`admin-sidebar-link btn border-0 rounded-0 text-start w-100 ${activeTab === 'homepage' ? 'active' : ''}`}
              onClick={() => handleTabClick('homepage')}
            >
              <i className="bi bi-layout-text-window-reverse"></i> Hero Management
            </button>
            <button 
              className={`admin-sidebar-link btn border-0 rounded-0 text-start w-100 ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => handleTabClick('about')}
            >
              <i className="bi bi-info-circle"></i> About Us Management
            </button>
            <button 
              className={`admin-sidebar-link btn border-0 rounded-0 text-start w-100 ${activeTab === 'rooms' ? 'active' : ''}`}
              onClick={() => handleTabClick('rooms')}
            >
              <i className="bi bi-door-open"></i> Accommodation Management
            </button>
            <button 
              className={`admin-sidebar-link btn border-0 rounded-0 text-start w-100 ${activeTab === 'restaurant-info' ? 'active' : ''}`}
              onClick={() => handleTabClick('restaurant-info')}
            >
              <i className="bi bi-shop"></i> Restaurant Management
            </button>
            <button 
              className={`admin-sidebar-link btn border-0 rounded-0 text-start w-100 ${activeTab === 'restaurant-menu' ? 'active' : ''}`}
              onClick={() => handleTabClick('restaurant-menu')}
            >
              <i className="bi bi-egg-fried"></i> Menu Management
            </button>
            <button 
              className={`admin-sidebar-link btn border-0 rounded-0 text-start w-100 ${activeTab === 'gallery' ? 'active' : ''}`}
              onClick={() => handleTabClick('gallery')}
            >
              <i className="bi bi-images"></i> Gallery Management
            </button>
            <button 
              className={`admin-sidebar-link btn border-0 rounded-0 text-start w-100 ${activeTab === 'panoramas' ? 'active' : ''}`}
              onClick={() => handleTabClick('panoramas')}
            >
              <i className="bi bi-globe"></i> 360° Tour Management
            </button>
            <button 
              className={`admin-sidebar-link btn border-0 rounded-0 text-start w-100 ${activeTab === 'treks' ? 'active' : ''}`}
              onClick={() => handleTabClick('treks')}
            >
              <i className="bi bi-signpost-split"></i> Popular Treks Management
            </button>
            <button 
              className={`admin-sidebar-link btn border-0 rounded-0 text-start w-100 ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => handleTabClick('reviews')}
            >
              <i className="bi bi-chat-left-quote"></i> Review Management
            </button>
            <button 
              className={`admin-sidebar-link btn border-0 rounded-0 text-start w-100 ${activeTab === 'contact-settings' ? 'active' : ''}`}
              onClick={() => handleTabClick('contact-settings')}
            >
              <i className="bi bi-telephone"></i> Contact Management
            </button>
            <button 
              className={`admin-sidebar-link btn border-0 rounded-0 text-start w-100 ${activeTab === 'system-settings' ? 'active' : ''}`}
              onClick={() => handleTabClick('system-settings')}
            >
              <i className="bi bi-gear"></i> Settings
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
          <button className="btn btn-sm btn-outline-danger w-100 rounded-0 text-uppercase py-2 mb-3" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }} onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i> Log Out
          </button>
          <div className="text-center text-muted" style={{ fontSize: '0.65rem', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
            © 2026 Pittam Deurali.<br />All Rights Reserved.
          </div>
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
            <div className="p-4 admin-quick-actions mb-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
              <h5 className="font-serif fw-bold mb-3" style={{ color: 'var(--color-gold)' }}>Quick Actions</h5>
              <div className="d-flex flex-wrap gap-2">
                <button className="btn btn-luxury" onClick={() => setActiveTab('bookings')}>Review Inquiries</button>
                <button className="btn btn-luxury-outline" onClick={() => setActiveTab('rooms')}>Add Room Variant</button>
                <button className="btn btn-luxury-outline" onClick={() => setActiveTab('gallery')}>Upload Image Asset</button>
                <button className="btn btn-luxury-outline" onClick={() => setActiveTab('reviews')}>Moderate Guest Reviews</button>
              </div>
            </div>

            {/* Review Analytics Cards */}
            <h5 className="font-serif fw-bold mb-3 text-white" style={{ color: 'var(--color-gold) !important' }}>Review & Rating Analytics</h5>
            <div className="row g-4 mb-5">
              <div className="col-lg-3 col-md-6">
                <div className="card-luxury p-4 admin-stat-card h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="small text-uppercase tracking-wider text-muted" style={{ fontSize: '0.7rem' }}>Total Reviews</span>
                    <i className="bi bi-chat-square-text fs-4 text-primary"></i>
                  </div>
                  <h2 className="fw-bold mb-0">{loadingStats ? '...' : stats.totalReviews}</h2>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="card-luxury p-4 admin-stat-card h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="small text-uppercase tracking-wider text-muted" style={{ fontSize: '0.7rem' }}>Pending Approval</span>
                    <i className="bi bi-hourglass-split fs-4 text-warning"></i>
                  </div>
                  <h2 className="fw-bold mb-0">{loadingStats ? '...' : stats.pendingReviews}</h2>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="card-luxury p-4 admin-stat-card h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="small text-uppercase tracking-wider text-muted" style={{ fontSize: '0.7rem' }}>Approved Reviews</span>
                    <i className="bi bi-check-circle fs-4 text-success"></i>
                  </div>
                  <h2 className="fw-bold mb-0">{loadingStats ? '...' : stats.approvedReviews}</h2>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="card-luxury p-4 admin-stat-card h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="small text-uppercase tracking-wider text-muted" style={{ fontSize: '0.7rem' }}>Average Rating</span>
                    <i className="bi bi-star-fill fs-4 text-gold" style={{ color: 'var(--color-gold)' }}></i>
                  </div>
                  <h2 className="fw-bold mb-0">{loadingStats ? '...' : stats.averageRating} <span className="fs-6 text-muted">/ 5.0</span></h2>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && <BookingManager />}
        {activeTab === 'rooms' && <CmsRooms />}
        {activeTab === 'gallery' && <CmsGallery />}
        {activeTab === 'homepage' && <CmsHomepage />}
        {activeTab === 'about' && <CmsAbout />}
        {activeTab === 'restaurant-info' && <CmsRestaurantInfo />}
        {activeTab === 'restaurant-menu' && <CmsRestaurantMenu />}
        {activeTab === 'treks' && <CmsTreks />}
        {activeTab === 'panoramas' && <CmsPanoramas />}
        {activeTab === 'reviews' && <CmsReviews />}
        {activeTab === 'contact-settings' && <CmsSettings mode="contact" />}
        {activeTab === 'system-settings' && <CmsSettings mode="system" />}
      </main>
    </div>
  );
};

export default Dashboard;

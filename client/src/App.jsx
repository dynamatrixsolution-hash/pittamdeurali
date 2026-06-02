import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ProtectedRoute from './components/ProtectedRoute';

// Public Page Imports
import Home from './pages/Public/Home';
import About from './pages/Public/About';
import Rooms from './pages/Public/Rooms';
import RoomDetail from './pages/Public/RoomDetail';
import Gallery from './pages/Public/Gallery';
import Treks from './pages/Public/Treks';
import Restaurant from './pages/Public/Restaurant';
import Blog from './pages/Public/Blog';
import Testimonials from './pages/Public/Testimonials';
import Contact from './pages/Public/Contact';

// Admin Page Imports
import Login from './pages/Admin/Login';
import Dashboard from './pages/Admin/Dashboard';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';

// Public Layout Wrapper
const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '80vh' }}>
        <Outlet />
      </div>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/rooms/:slug" element={<RoomDetail />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/treks" element={<Treks />} />
            <Route path="/restaurant" element={<Restaurant />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Admin Authentication */}
          <Route path="/admin/login" element={<Login />} />

          {/* Protected Admin Console */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
          </Route>

          {/* Fallback Catch-All */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

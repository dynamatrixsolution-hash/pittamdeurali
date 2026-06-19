import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ProtectedRoute from './components/ProtectedRoute';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';

const Home = lazy(() => import('./pages/Public/Home'));
const About = lazy(() => import('./pages/Public/About'));
const Rooms = lazy(() => import('./pages/Public/Rooms'));
const RoomDetail = lazy(() => import('./pages/Public/RoomDetail'));
const Gallery = lazy(() => import('./pages/Public/Gallery'));
const Treks = lazy(() => import('./pages/Public/Treks'));
const TrekDetail = lazy(() => import('./pages/Public/TrekDetail'));
const Restaurant = lazy(() => import('./pages/Public/Restaurant'));
const Blog = lazy(() => import('./pages/Public/Blog'));
const Testimonials = lazy(() => import('./pages/Public/Testimonials'));
const Contact = lazy(() => import('./pages/Public/Contact'));
const Services = lazy(() => import('./pages/Public/Services'));
const Location = lazy(() => import('./pages/Public/Location'));
const Booking = lazy(() => import('./pages/Public/Booking'));
const Login = lazy(() => import('./pages/Admin/Login'));
const Dashboard = lazy(() => import('./pages/Admin/Dashboard'));

const PageLoader = () => (
  <div className="app-loader" role="status" aria-live="polite">
    <div className="spinner-border spinner-luxury" aria-hidden="true"></div>
    <span className="visually-hidden">Loading...</span>
  </div>
);

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
    <HelmetProvider>
      <ThemeProvider>
        <Router basename={import.meta.env.BASE_URL}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/rooms/:slug" element={<RoomDetail />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/treks" element={<Treks />} />
                <Route path="/treks/:id" element={<TrekDetail />} />
                <Route path="/restaurant" element={<Restaurant />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/services" element={<Services />} />
                <Route path="/location" element={<Location />} />
                <Route path="/booking" element={<Booking />} />
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
          </Suspense>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;

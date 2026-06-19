import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ProtectedRoute from './components/ProtectedRoute';
import SEO from './components/SEO/SEO';

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
const PothanaGuide = lazy(() => import('./pages/Public/PothanaGuide'));
const DhampusGuide = lazy(() => import('./pages/Public/DhampusGuide'));
const AustralianCampGuide = lazy(() => import('./pages/Public/AustralianCampGuide'));
const MardiHimalAccommodation = lazy(() => import('./pages/Public/MardiHimalAccommodation'));
const AnnapurnaTrekLodge = lazy(() => import('./pages/Public/AnnapurnaTrekLodge'));
const KandeToPothana = lazy(() => import('./pages/Public/KandeToPothana'));
const PokharaToPothana = lazy(() => import('./pages/Public/PokharaToPothana'));
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
      <SEO 
        title="Pitam Deurali Guest House | Mountain Lodge in Pothana"
        description="Stay at Pitam Deurali Guest House in Pothana. Enjoy stunning Himalayan views, cozy rooms, and delicious local food near Mardi Himal Trek and Dhampus."
        url="/"
        type="WebSite"
      />
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
                <Route path="/pothana-accommodation-guide" element={<PothanaGuide />} />
                <Route path="/dhampus-travel-guide" element={<DhampusGuide />} />
                <Route path="/australian-camp-guide" element={<AustralianCampGuide />} />
                <Route path="/mardi-himal-trek-accommodation" element={<MardiHimalAccommodation />} />
                <Route path="/annapurna-trek-lodge" element={<AnnapurnaTrekLodge />} />
                <Route path="/kande-to-pothana-trek-guide" element={<KandeToPothana />} />
                <Route path="/pokhara-to-pothana-travel-guide" element={<PokharaToPothana />} />
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

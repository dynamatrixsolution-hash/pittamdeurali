import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { getAPIImageUrl } from '../../services/api';
import trekMap from '../../assets/trek-map.jpg';
import SEO from '../../components/SEO';

const Treks = () => {
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    whatsappNumber: '9779801234567'
  });

  useEffect(() => {
    const fetchTreks = async () => {
      try {
        const res = await api.get('/treks');
        if (res.success) {
          setTreks(res.data);
        }
      } catch (err) {
        console.error('Error loading treks:', err);
      } finally {
        setLoading(false);
      }
    };
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.success && res.data) {
          setSettings(res.data);
        }
      } catch (err) {
        console.error('Error loading settings:', err);
      }
    };
    fetchTreks();
    fetchSettings();
  }, []);


  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return <span className="badge bg-success text-white">Easy</span>;
      case 'Moderate':
        return <span className="badge bg-info text-white">Moderate</span>;
      case 'Hard':
        return <span className="badge bg-warning text-dark">Hard</span>;
      case 'Challenging':
        return <span className="badge bg-danger text-white">Challenging</span>;
      default:
        return <span className="badge bg-secondary text-white">{difficulty}</span>;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh', color: 'var(--color-gold)' }}>
        <div className="spinner-border spinner-luxury" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const cleanWhatsappNumber = settings?.whatsappNumber ? settings.whatsappNumber.replace(/[+\s-]/g, '') : '9779801234567';

  return (
    <div className="container py-5 fade-in-up">
      <SEO 
        title="Trekking & Activities | Pothana, Dhampus & Mardi Trek Lodge"
        description="Explore popular treks and activities near Pothana, including Mardi Himal Trek, Australian Camp hike, and Dhampus Village walks from New Pittam Deurali Guest House."
        keywords={[
          "Pittam Deurali Guest House", "Pothana Guest House", "Dhampus Guest House", "Mardi Trek Lodge", 
          "Mardi Trek Guest House", "Guest House near Mardi Himal Trek", "Mardi Himal Trekking Stay", 
          "Hotel near Australian Camp", "Annapurna Trek Lodge Activities", "Dhampus Village Hikes", 
          "Pothana Trekking Guide", "Deurali Guest House Treks", "Trekking Lodge Nepal Activities", 
          "Stay in Pothana Hikes", "Best Guest House in Dhampus Guided Walks", "Pokhara Trekking Stay Routes", 
          "Annapurna Conservation Area Activities", "Kaski Nepal Trekking Trails", "Family Guest House Nepal Tours", 
          "Budget Hotel Dhampus Day Hikes", "Gandaki Province Hiking Trails", "Pothana to Forest Camp Trek", 
          "Landruk Trek Stay", "Jhinu Hot Springs Trek", "Australian Camp Day Hikes"
        ]}
        slug="/treks"
      />
      {/* Page Header */}
      <div className="row justify-content-center text-center mb-5">
        <div className="col-lg-8 col-11">
          <h6 className="text-uppercase fw-semibold" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em', fontSize: '0.75rem' }}>
            Adventure
          </h6>
          <h1 className="display-4 font-serif fw-bold my-2 text-white">
            Popular Trekking Routes
          </h1>
          <div className="gold-accent-line"></div>
          <p className="lead text-secondary" style={{ fontSize: '1rem' }}>
            Discover the most breathtaking Himalayan treks starting near Pitam Deurali. We offer route guidance, maps, and local porter/guide booking coordinates.
          </p>
        </div>
      </div>

      {/* Left/Right Column Layout */}
      <div className="row g-5">
        {/* Left Column: Trekking Map */}
        <div className="col-lg-6 col-12">
          <div className="sticky-lg-top" style={{ top: '100px', zIndex: 5 }}>
            <h4 className="font-serif fw-bold mb-3 text-white">Trekking Route Map</h4>
            <div style={{ border: '1px solid var(--border-color)', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-card)' }}>
              <img 
                src={trekMap} 
                className="img-fluid w-100" 
                style={{ objectFit: 'contain', borderRadius: '4px', maxHeight: '550px' }} 
                alt="Trekking Routes Approach Map"
              />
            </div>
            <div className="mt-4 p-4 card-luxury">
              <h5 className="font-serif fw-bold text-white mb-2">
                <i className="bi bi-info-circle me-2 text-gold" style={{ color: 'var(--color-gold)' }}></i>
                About the Routes
              </h5>
              <p className="small text-secondary lh-lg mb-0" style={{ fontSize: '0.9rem' }}>
                Two scenic approach routes from Pokhara converge at Pothana and continue together to New Pittam Deurali Guest House & Restaurant and Deurali. From Deurali, the trek continues onward toward Mardi Himal or Annapurna Base Camp.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Popular Treks List */}
        <div className="col-lg-6 col-12">
          <h4 className="font-serif fw-bold mb-3 text-white">Featured Treks</h4>
          <div className="row g-4">
            {treks.map(trek => (
              <div className="col-12" key={trek._id}>
                <div className="card-luxury h-100 overflow-hidden">
                  <div className="row g-0 h-100">
                    <div className="col-md-5 col-12" style={{ minHeight: '200px', position: 'relative' }}>
                      <img 
                        src={getAPIImageUrl(trek.image)} 
                        className="w-100 h-100" 
                        style={{ objectFit: 'cover' }} 
                        alt={trek.name}
                      />
                      <div className="position-absolute top-3 start-3">
                        {getDifficultyBadge(trek.difficulty)}
                      </div>
                    </div>
                    <div className="col-md-7 col-12 p-4 d-flex flex-column justify-content-between">
                      <div>
                        <h5 className="font-serif fw-bold mb-2 text-white">{trek.name}</h5>
                        <div className="d-flex align-items-center text-secondary small mb-2">
                          <i className="bi bi-clock me-2 text-gold" style={{ color: 'var(--color-gold)' }}></i>
                          <span>Duration: <strong>{trek.duration}</strong></span>
                        </div>
                        <p className="small text-secondary lh-lg mb-0" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {trek.description}
                        </p>
                      </div>
                      
                      <div className="border-top pt-3 mt-3 d-flex flex-column gap-2" style={{ borderColor: 'var(--border-color)' }}>
                        <Link 
                          to={`/treks/${trek._id}`}
                          className="btn btn-blue w-100 text-center py-2 text-decoration-none"
                          style={{ fontSize: '0.8rem' }}
                        >
                          View Itinerary & Map
                        </Link>
                        <a 
                          href={`https://wa.me/${cleanWhatsappNumber}?text=Hi,%20I'm%20interested%20in%20arranging%20a%20guide%20and%20trekking%20details%20for%20the%20${encodeURIComponent(trek.name)}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-blue-outline w-100 text-center py-2 text-decoration-none"
                          style={{ fontSize: '0.8rem' }}
                        >
                          Inquire Details
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {treks.length === 0 && (
              <div className="col-12 text-center my-5 text-secondary py-5">
                <h5 className="font-serif text-secondary">No trekking routes registered yet.</h5>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Treks;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { getAPIImageUrl } from '../../services/api';

const TrekDetail = () => {
  const { id } = useParams();
  const [trek, setTrek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    hotelName: 'New Pittam Deurali Guest House & Restaurant',
    whatsappNumber: '9779801234567'
  });

  useEffect(() => {
    const fetchTrekDetails = async () => {
      try {
        const res = await api.get(`/treks/${id}`);
        if (res.success) {
          setTrek(res.data);
        }
      } catch (err) {
        console.error('Error fetching trek details:', err);
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
    fetchTrekDetails();
    fetchSettings();
  }, [id]);

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return <span className="badge bg-success text-white px-3 py-2">Easy</span>;
      case 'Moderate':
        return <span className="badge bg-info text-white px-3 py-2">Moderate</span>;
      case 'Hard':
        return <span className="badge bg-warning text-dark px-3 py-2">Hard</span>;
      case 'Challenging':
        return <span className="badge bg-danger text-white px-3 py-2">Challenging</span>;
      default:
        return <span className="badge bg-secondary text-white px-3 py-2">{difficulty}</span>;
    }
  };

  const parseItinerary = (text) => {
    if (!text) return [];
    return text.split('\n').filter(line => line.trim().length > 0).map((line, idx) => {
      // Matches "Day X:", "Day X -", "Day X"
      const match = line.match(/^(Day \d+[:\-]?)(.*)$/i);
      if (match) {
        return { day: match[1].replace(/[:\-]/g, '').trim(), content: match[2].trim() };
      }
      return { day: `Day ${idx + 1}`, content: line.trim() };
    });
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

  if (!trek) {
    return (
      <div className="container py-5 text-center">
        <h3 className="font-serif my-5 text-white">Trekking Route not found.</h3>
        <Link to="/treks" className="btn btn-blue">Explore Trekking Routes</Link>
      </div>
    );
  }

  const itinerarySteps = parseItinerary(trek.itinerary);
  const cleanWhatsappNumber = settings?.whatsappNumber ? settings.whatsappNumber.replace(/[+\s-]/g, '') : '9779801234567';

  return (
    <div className="container py-5 fade-in-up">
      <Link to="/treks" className="text-decoration-none small d-inline-flex align-items-center mb-4" style={{ color: 'var(--color-gold)' }}>
        <i className="bi bi-arrow-left me-2"></i> Back to Trekking Routes
      </Link>

      <div className="row g-5">
        {/* Main Details Column */}
        <div className="col-lg-8">
          <div className="d-flex align-items-center gap-3 mb-2">
            {getDifficultyBadge(trek.difficulty)}
            <span className="small text-muted text-uppercase tracking-wider">
              {trek.duration} Duration
            </span>
          </div>

          <h1 className="font-serif fw-bold text-white mb-3 display-5">{trek.name}</h1>
          <div className="gold-accent-line left mb-4"></div>

          {/* Hero Banner */}
          <div className="mb-5" style={{ height: '450px', border: '1px solid var(--border-color)', overflow: 'hidden', borderRadius: '8px' }}>
            <img 
              src={getAPIImageUrl(trek.image)} 
              alt={trek.name} 
              className="w-100 h-100" 
              style={{ objectFit: 'cover' }}
            />
          </div>

          {/* Overview */}
          <h5 className="font-serif fw-bold text-white mb-3">Trek Overview</h5>
          <p className="lh-lg text-secondary mb-5" style={{ textAlign: 'justify', fontSize: '0.95rem' }}>
            {trek.longDescription || trek.description}
          </p>

          {/* Timeline Itinerary */}
          {itinerarySteps.length > 0 && (
            <div>
              <h5 className="font-serif fw-bold text-white mb-4">Day-by-Day Itinerary</h5>
              
              <div className="ps-3 position-relative" style={{ borderLeft: '2px dashed var(--border-color)' }}>
                {itinerarySteps.map((step, idx) => (
                  <div className="position-relative mb-4 pb-2 ps-4" key={idx}>
                    {/* Circle Node */}
                    <div 
                      className="position-absolute d-flex align-items-center justify-content-center fw-bold small text-white text-nowrap"
                      style={{
                        left: '-31px',
                        top: '0px',
                        width: '56px',
                        height: '24px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--color-gold)',
                        fontSize: '0.65rem',
                        letterSpacing: '0.05em',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                      }}
                    >
                      {step.day}
                    </div>
                    {/* Content */}
                    <div className="card-luxury p-3">
                      <p className="small text-secondary lh-lg mb-0" style={{ fontSize: '0.85rem' }}>
                        {step.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="col-lg-4">
          {/* Quick Facts Specs Card */}
          <div className="p-4 mb-4" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
            <h4 className="font-serif fw-bold text-white mb-3" style={{ color: 'var(--color-gold)' }}>Trek Details</h4>
            
            <div className="d-flex flex-column gap-3 small">
              <div className="d-flex justify-content-between border-bottom pb-2" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-secondary"><i className="bi bi-bar-chart me-2"></i>Difficulty</span>
                <span className="fw-semibold text-white">{trek.difficulty}</span>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-2" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-secondary"><i className="bi bi-clock me-2"></i>Duration</span>
                <span className="fw-semibold text-white">{trek.duration}</span>
              </div>
              {trek.maxElevation && (
                <div className="d-flex justify-content-between border-bottom pb-2" style={{ borderColor: 'var(--border-color)' }}>
                  <span className="text-secondary"><i className="bi bi-graph-up me-2"></i>Max Elevation</span>
                  <span className="fw-semibold text-white">{trek.maxElevation}</span>
                </div>
              )}
              {trek.bestSeason && (
                <div className="d-flex justify-content-between border-bottom pb-2" style={{ borderColor: 'var(--border-color)' }}>
                  <span className="text-secondary"><i className="bi bi-calendar-range me-2"></i>Best Season</span>
                  <span className="fw-semibold text-white">{trek.bestSeason}</span>
                </div>
              )}
              {trek.startPoint && (
                <div className="d-flex justify-content-between pb-1" style={{ borderColor: 'var(--border-color)' }}>
                  <span className="text-secondary"><i className="bi bi-geo-alt me-2"></i>Starting Point</span>
                  <span className="fw-semibold text-white">{trek.startPoint}</span>
                </div>
              )}
            </div>
          </div>

          {/* WhatsApp Booking CTA */}
          <div className="p-4 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
            <h5 className="font-serif fw-bold text-white mb-3">Arrange Guide & Permit</h5>
            <p className="small text-secondary lh-lg mb-4" style={{ fontSize: '0.85rem' }}>
              Treks in the Annapurna Conservation Area require local TIMS permits and experienced guides. Contact our family desk to hire certified local guides and porters directly from Deurali.
            </p>
            
            <a 
              href={`https://wa.me/${cleanWhatsappNumber}?text=Hi,%20I'm%20planning%20the%20${encodeURIComponent(trek.name)}%20trek%20and%20would%20like%20to%20arrange%20local%20guides/permit%20assistance.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success w-100 py-3 d-flex align-items-center justify-content-center gap-2"
              style={{ border: 'none' }}
            >
              <i className="bi bi-whatsapp"></i> WhatsApp Family Desk
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrekDetail;

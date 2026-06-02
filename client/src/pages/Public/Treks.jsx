import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Treks = () => {
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);

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
    fetchTreks();
  }, []);

  const getAPIImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
    return `${baseUrl}${url}`;
  };

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

  return (
    <div className="container py-5 fade-in-up">
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

      {/* Treks Grid */}
      <div className="row g-4 justify-content-center text-start">
        {treks.map(trek => (
          <div className="col-lg-4 col-md-6" key={trek._id}>
            <div className="card-luxury h-100 d-flex flex-column justify-content-between">
              <div>
                <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
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
                <div className="p-4">
                  <h4 className="font-serif fw-bold mb-2 text-white">{trek.name}</h4>
                  <div className="d-flex align-items-center text-secondary small mb-3">
                    <i className="bi bi-clock me-2 text-gold" style={{ color: 'var(--color-gold)' }}></i>
                    <span>Duration: <strong>{trek.duration}</strong></span>
                  </div>
                  <p className="small text-secondary lh-lg mb-0">{trek.description}</p>
                </div>
              </div>
              
              <div className="px-4 pb-4">
                <div className="border-top pt-3" style={{ borderColor: 'var(--border-color)' }}>
                  <a 
                    href={`https://wa.me/9779801234567?text=Hi,%20I'm%20interested%20in%20arranging%20a%20guide%20and%20trekking%20details%20for%20the%20${encodeURIComponent(trek.name)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-blue-outline w-100 text-center py-2 text-decoration-none"
                  >
                    Inquire Details
                  </a>
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
  );
};

export default Treks;

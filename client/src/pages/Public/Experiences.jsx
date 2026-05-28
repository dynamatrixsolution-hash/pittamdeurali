import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Experiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await api.get('/experiences');
        if (res.success) {
          setExperiences(res.data);
        }
      } catch (err) {
        console.error('Error loading experiences:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  const getAPIImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url}`;
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
      <div className="row justify-content-center text-center mb-5">
        <div className="col-lg-8 col-11">
          <h6 className="text-uppercase fw-semibold" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em', fontSize: '0.75rem' }}>
            Experiences
          </h6>
          <h1 className="display-4 font-serif fw-bold my-2 text-white">Pokhara Expeditions</h1>
          <div className="gold-accent-line"></div>
          <p className="lead text-secondary" style={{ fontSize: '1rem' }}>
            Bespoke tours and guided activities designed to reveal the heights and waters of Nepal.
          </p>
        </div>
      </div>

      <div className="row g-4 mt-2 justify-content-center text-start">
        {experiences.map(exp => (
          <div className="col-lg-4 col-md-6" key={exp._id}>
            <div className="card-luxury h-100 d-flex flex-column justify-content-between">
              <div>
                <div style={{ height: '240px', overflow: 'hidden' }}>
                  <img 
                    src={getAPIImageUrl(exp.image)} 
                    className="w-100 h-100" 
                    style={{ objectFit: 'cover' }} 
                    alt={exp.title}
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-serif fw-bold mb-3 text-white">{exp.title}</h4>
                  <p className="small text-secondary lh-lg mb-0">{exp.description}</p>
                </div>
              </div>
              
              <div className="px-4 pb-4">
                <div className="d-flex justify-content-between align-items-center border-top pt-3" style={{ borderColor: 'var(--border-color)' }}>
                  <span className="small text-secondary">Inquire for reservations</span>
                  <span className="fw-bold fs-6 text-white">${exp.price}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experiences;

import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';
import { getAPIImageUrl } from '../../services/api';

const MardiHimalAccommodation = () => {
  return (
    <div className="fade-in-up">
      <SEO 
        title="Best Lodge on Mardi Himal Trek | Accommodation & Tea House"
        description="Book the best Mardi Himal Trek Accommodation. We are the premier family lodge, guest house, and trek stopover on the Mardi Himal route."
        keywords={[
          "Mardi Himal Trek Accommodation", "Mardi Himal Trek Guest House", "Mardi Himal Trek Lodge",
          "Mardi Himal Trek Hotel", "Best Lodge on Mardi Himal Trek", "Stay During Mardi Himal Trek",
          "Tea House Mardi Himal Trek", "Budget Accommodation Mardi Himal Trek", "Family Lodge Mardi Himal Trek",
          "Overnight Stay Mardi Himal Trek", "Mardi Himal Trek Route Accommodation", "Mardi Himal Trek Stopover",
          "Book Mardi Himal Accommodation", "Best Overnight Stop Mardi Himal Trek", "Affordable Accommodation Mardi Himal Trek"
        ]}
        slug="/mardi-himal-trek-accommodation"
      />

      <section className="hero-slider" style={{ height: '50vh', minHeight: '400px' }}>
        <div className="hero-slide active" style={{ backgroundImage: `url('${getAPIImageUrl('/uploads/image copy 8.png')}')` }}>
          <div className="hero-slide-overlay" style={{ background: 'rgba(0,0,0,0.6)' }}></div>
          <div className="hero-slide-content">
            <div className="container text-center">
              <h1 className="display-4 fw-bold font-serif text-white">Mardi Himal Trek Accommodation</h1>
              <p className="fs-5 text-white fw-light mt-3">The premier lodge and tea house on the Mardi route.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-12 text-center mb-5">
              <h2 className="display-6 font-serif fw-bold" style={{ color: 'var(--text-primary)' }}>Best Lodge on Mardi Himal Trek</h2>
              <div className="gold-accent-line mx-auto"></div>
              <p className="mt-4 lh-lg text-secondary">
                Your journey to Mardi Himal Base Camp requires proper rest. We are widely considered the <strong>Best Overnight Stop Mardi Himal Trek</strong> due to our modern amenities, hot showers, and thick wooden rooms that protect against the mountain cold.
              </p>
            </div>
          </div>

          <div className="row g-5">
            <div className="col-md-4">
              <div className="card-luxury p-4 h-100 text-center">
                <i className="bi bi-house-heart fs-1 text-gold mb-3 d-block" style={{ color: 'var(--color-gold)' }}></i>
                <h4 className="font-serif fw-bold">Family Lodge</h4>
                <p className="text-secondary small mt-3">A safe, warm, and highly rated <strong>Family Lodge Mardi Himal Trek</strong> option with private rooms.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card-luxury p-4 h-100 text-center">
                <i className="bi bi-cup-hot fs-1 text-gold mb-3 d-block" style={{ color: 'var(--color-gold)' }}></i>
                <h4 className="font-serif fw-bold">Tea House</h4>
                <p className="text-secondary small mt-3">An authentic <strong>Tea House Mardi Himal Trek</strong> experience featuring wood-fired local meals and organic coffee.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card-luxury p-4 h-100 text-center">
                <i className="bi bi-wallet2 fs-1 text-gold mb-3 d-block" style={{ color: 'var(--color-gold)' }}></i>
                <h4 className="font-serif fw-bold">Budget Friendly</h4>
                <p className="text-secondary small mt-3">We provide high-quality but <strong>Affordable Accommodation Mardi Himal Trek</strong> to fit all budgets.</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-5">
            <Link to="/booking" className="btn btn-primary fw-bold px-5 py-3">Book Mardi Himal Accommodation</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MardiHimalAccommodation;

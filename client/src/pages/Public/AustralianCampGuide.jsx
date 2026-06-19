import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';

const AustralianCampGuide = () => {
  return (
    <div className="fade-in-up">
      <SEO 
        title="Hotel Near Australian Camp | Lodge & Accommodation"
        description="Searching for the best hotel near Australian Camp? Book an overnight stay at our Himalayan view lodge, just a short trek from Australian Camp."
        keywords={[
          "Hotel Near Australian Camp", "Australian Camp Accommodation", "Australian Camp Guest House",
          "Australian Camp Trekking Lodge", "Stay Near Australian Camp", "Lodge Near Australian Camp",
          "Budget Accommodation Australian Camp", "Best Hotel Near Australian Camp", "Australian Camp Trek Stop",
          "Overnight Stay Near Australian Camp", "Australian Camp View Hotel", "Tea House Near Australian Camp",
          "Book Stay Near Australian Camp"
        ]}
        slug="/australian-camp-guide"
      />

      <section className="hero-slider" style={{ height: '50vh', minHeight: '400px' }}>
        <div className="hero-slide active" style={{ backgroundImage: `url('/uploads/image copy 7.png')` }}>
          <div className="hero-slide-overlay" style={{ background: 'rgba(0,0,0,0.6)' }}></div>
          <div className="hero-slide-content">
            <div className="container text-center">
              <h1 className="display-4 fw-bold font-serif text-white">Australian Camp Accommodation</h1>
              <p className="fs-5 text-white fw-light mt-3">Discover the best lodge and guest house near Australian Camp.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-12 text-center mb-5">
              <h2 className="display-6 font-serif fw-bold" style={{ color: 'var(--text-primary)' }}>Stay Near Australian Camp</h2>
              <div className="gold-accent-line mx-auto"></div>
              <p className="mt-4 lh-lg text-secondary">
                Australian Camp is famous for its wide-open meadows and spectacular views of the Annapurna range. However, during peak seasons, finding a quiet <strong>Australian Camp Guest House</strong> can be difficult. That's why trekkers prefer an <strong>Overnight Stay Near Australian Camp</strong> at our lodge in Deurali.
              </p>
            </div>
          </div>

          <div className="row g-5 align-items-center">
            <div className="col-md-6 text-center">
              <div className="p-5" style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <h3 className="font-serif fw-bold mb-3 text-gold" style={{ color: 'var(--color-gold)' }}>Just 45 Minutes Away</h3>
                <p className="lh-lg text-secondary mb-0">
                  We are the <strong>Best Hotel Near Australian Camp</strong> located just a short, scenic 45-minute forest walk away. Enjoy a serene environment, better rates, and authentic hospitality while still catching the exact same Himalayan sunrise.
                </p>
              </div>
              <Link to="/booking" className="btn btn-primary fw-bold px-4 py-2 mt-4">Book Stay Near Australian Camp</Link>
            </div>
            <div className="col-md-6">
              <img src="/uploads/image copy 6.png" alt="Australian Camp View Hotel" className="img-fluid rounded shadow-sm" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AustralianCampGuide;

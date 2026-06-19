import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';
import { getAPIImageUrl } from '../../services/api';

const AnnapurnaTrekLodge = () => {
  return (
    <div className="fade-in-up">
      <SEO 
        title="Annapurna Trek Lodge | Best Accommodation & Guest House"
        description="Book the best Annapurna Trek Lodge. New Pittam Deurali offers budget trekking accommodation, family stays, and mountain view rooms in Nepal."
        keywords={[
          "Annapurna Trek Lodge", "Annapurna Accommodation", "Annapurna Trek Guest House",
          "Annapurna Base Camp Route Lodge", "Annapurna Trek Stay", "Annapurna Trek Hotel",
          "Trekking Lodge Annapurna Region", "Best Lodge Annapurna Trek", "Family Accommodation Annapurna",
          "Best Guest House Booking Annapurna Trek", "Eco Friendly Lodge Annapurna Region"
        ]}
        slug="/annapurna-trek-lodge"
      />

      <section className="hero-slider" style={{ height: '50vh', minHeight: '400px' }}>
        <div className="hero-slide active" style={{ backgroundImage: `url('${getAPIImageUrl('/uploads/image copy.png')}')` }}>
          <div className="hero-slide-overlay" style={{ background: 'rgba(0,0,0,0.6)' }}></div>
          <div className="hero-slide-content">
            <div className="container text-center">
              <h1 className="display-4 fw-bold font-serif text-white">Annapurna Trek Lodge</h1>
              <p className="fs-5 text-white fw-light mt-3">Your Gateway to the Annapurna Base Camp Route</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container text-center">
          <h2 className="display-6 font-serif fw-bold mb-4" style={{ color: 'var(--text-primary)' }}>Trekking Lodge Annapurna Region</h2>
          <div className="gold-accent-line mx-auto mb-5"></div>
          <p className="lh-lg text-secondary mx-auto" style={{ maxWidth: '800px' }}>
            New Pittam Deurali Guest House is strategically located on the main intersection connecting the Mardi Himal trail and the classic <strong>Annapurna Base Camp Route Lodge</strong> trail. As an <strong>Eco Friendly Lodge Annapurna Region</strong>, we pride ourselves on sustainable tourism, organic food, and premium <strong>Annapurna Accommodation</strong> for exhausted trekkers.
          </p>
          
          <Link to="/booking" className="btn btn-primary fw-bold px-4 py-2 mt-4">Best Guest House Booking Annapurna Trek</Link>
        </div>
      </section>
    </div>
  );
};

export default AnnapurnaTrekLodge;

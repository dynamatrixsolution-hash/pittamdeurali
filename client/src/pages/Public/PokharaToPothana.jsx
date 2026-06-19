import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';

const PokharaToPothana = () => {
  return (
    <div className="fade-in-up">
      <SEO 
        title="Pokhara to Pothana Travel Guide | Best Trek Stop Near Pokhara"
        description="The ultimate Pokhara to Pothana travel guide. Discover the best trekking accommodation near Pokhara with stunning Himalayan mountain views."
        keywords={[
          "Pokhara Trekking Accommodation", "Pokhara Trek Lodge", "Pokhara Mountain View Hotel",
          "Kaski Trekking Lodge", "Gandaki Province Accommodation", "Himalayan View Accommodation Nepal",
          "Nepal Trekking Accommodation", "Trekking Lodge Nepal", "Mountain Guest House Nepal",
          "Best Trekking Hotel Nepal", "Best Trek Stop Near Pokhara"
        ]}
        slug="/pokhara-to-pothana-travel-guide"
      />

      <section className="hero-slider" style={{ height: '50vh', minHeight: '400px' }}>
        <div className="hero-slide active" style={{ backgroundImage: `url('/uploads/image copy 8.png')` }}>
          <div className="hero-slide-overlay" style={{ background: 'rgba(0,0,0,0.6)' }}></div>
          <div className="hero-slide-content">
            <div className="container text-center">
              <h1 className="display-4 fw-bold font-serif text-white">Pokhara to Pothana Travel Guide</h1>
              <p className="fs-5 text-white fw-light mt-3">The Best Trek Stop Near Pokhara</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container text-center">
          <h2 className="display-6 font-serif fw-bold mb-4" style={{ color: 'var(--text-primary)' }}>Best Trekking Hotel Nepal</h2>
          <div className="gold-accent-line mx-auto mb-5"></div>
          <p className="lh-lg text-secondary mx-auto" style={{ maxWidth: '800px' }}>
            When leaving Pokhara for your trek, your first night is crucial. As the leading <strong>Pokhara Trek Lodge</strong> alternative, New Pittam Deurali Guest House gives you the true <strong>Himalayan View Accommodation Nepal</strong> experience. We are the ultimate <strong>Kaski Trekking Lodge</strong> providing organic food and warm beds before you head deeper into the Himalayas.
          </p>
          
          <Link to="/booking" className="btn btn-primary fw-bold px-4 py-2 mt-4">Reserve Trekking Lodge Nepal</Link>
        </div>
      </section>
    </div>
  );
};

export default PokharaToPothana;

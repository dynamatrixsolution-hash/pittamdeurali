import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';
import FAQAccordion from '../../components/SEO/FAQAccordion';
import { getAPIImageUrl } from '../../services/api';

const PothanaGuide = () => {
  return (
    <div className="fade-in-up">
      <SEO 
        title="Best Guest House in Pothana | Stay in Pothana Village Hotel"
        description="Looking for the best hotel in Pothana? Book your stay at New Pittam Deurali Guest House. Enjoy mountain views, family-friendly rooms, and budget accommodation near Mardi Himal."
        keywords={[
          "Pothana Guest House", "Best Guest House in Pothana", "Hotel in Pothana", 
          "Stay in Pothana", "Pothana Accommodation", "Pothana Trekking Lodge", 
          "Budget Hotel Pothana", "Family Hotel Pothana", "Mountain View Hotel Pothana", 
          "Pothana Trek Stop", "Lodge Near Pothana", "Tea House in Pothana", 
          "Pothana Village Stay", "Overnight Stay in Pothana", "Pothana Mardi Himal Trek Lodge", 
          "Best Stay in Pothana Nepal", "Cheap Hotel Pothana", "Book Hotel in Pothana",
          "Where to Stay in Pothana"
        ]}
        slug="/pothana-accommodation-guide"
      />

      <section className="hero-slider" style={{ height: '50vh', minHeight: '400px' }}>
        <div className="hero-slide active" style={{ backgroundImage: `url('${getAPIImageUrl('/uploads/image copy.png')}')` }}>
          <div className="hero-slide-overlay" style={{ background: 'rgba(0,0,0,0.6)' }}></div>
          <div className="hero-slide-content">
            <div className="container text-center">
              <h1 className="display-4 fw-bold font-serif text-white">Best Guest House in Pothana</h1>
              <p className="fs-5 text-white fw-light mt-3">Your ultimate guide to Pothana accommodation, hotels, and trekking lodges.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-12 text-center mb-5">
              <h2 className="display-6 font-serif fw-bold" style={{ color: 'var(--text-primary)' }}>Stay in Pothana Village</h2>
              <div className="gold-accent-line mx-auto"></div>
              <p className="mt-4 lh-lg text-secondary">
                Pothana is a picturesque Gurung village located on the ridge above Dhampus. It serves as a vital trek stop for adventurers heading to the Mardi Himal Trek or Annapurna Base Camp. When looking for the <strong>best hotel in Pothana</strong>, trekkers want comfortable beds, hot showers, and unobstructed mountain views.
              </p>
            </div>
          </div>

          <div className="row g-5 align-items-center">
            <div className="col-md-6">
              <img src={getAPIImageUrl('/uploads/image copy 6.png')} alt="Pothana Guest House Accommodation" className="img-fluid rounded shadow-sm" />
            </div>
            <div className="col-md-6">
              <h3 className="font-serif fw-bold mb-3">Why Book Your Stay With Us?</h3>
              <ul className="list-unstyled lh-lg text-secondary">
                <li><i className="bi bi-check-circle-fill text-success me-2"></i> <strong>Mountain View Hotel Pothana:</strong> Direct views of Mount Machhapuchhre.</li>
                <li><i className="bi bi-check-circle-fill text-success me-2"></i> <strong>Budget Hotel Pothana:</strong> Affordable rates without sacrificing comfort.</li>
                <li><i className="bi bi-check-circle-fill text-success me-2"></i> <strong>Family Hotel Pothana:</strong> Safe, welcoming, and perfect for family stays.</li>
                <li><i className="bi bi-check-circle-fill text-success me-2"></i> <strong>Pothana Mardi Himal Trek Lodge:</strong> The perfect overnight stay before heading up to Forest Camp.</li>
              </ul>
              <Link to="/booking" className="btn btn-primary fw-bold px-4 py-2 mt-3">Book Hotel in Pothana</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <FAQAccordion />
        </div>
      </section>
    </div>
  );
};

export default PothanaGuide;

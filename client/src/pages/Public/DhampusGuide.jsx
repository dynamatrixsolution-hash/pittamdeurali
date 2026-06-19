import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';
import { getAPIImageUrl } from '../../services/api';

const DhampusGuide = () => {
  return (
    <div className="fade-in-up">
      <SEO 
        title="Best Hotel in Dhampus | Dhampus Trekking Lodge & Guest House"
        description="Find the best accommodation in Dhampus. New Pittam Deurali offers budget and family stays near Dhampus village. Book your Dhampus room online today."
        keywords={[
          "Dhampus Guest House", "Hotel in Dhampus", "Stay in Dhampus", "Best Hotel in Dhampus",
          "Dhampus Accommodation", "Dhampus Trekking Lodge", "Budget Hotel Dhampus", "Family Stay Dhampus",
          "Mountain View Hotel Dhampus", "Dhampus Village Stay", "Dhampus Trek Stop", "Lodge Near Dhampus",
          "Overnight Stay in Dhampus", "Best Accommodation in Dhampus", "Cheap Hotel Dhampus",
          "Hotel Reservation Dhampus", "Where to Stay in Dhampus", "Best Lodge Near Dhampus Village"
        ]}
        slug="/dhampus-travel-guide"
      />

      <section className="hero-slider" style={{ height: '50vh', minHeight: '400px' }}>
        <div className="hero-slide active" style={{ backgroundImage: `url('${getAPIImageUrl('/uploads/image copy 8.png')}')` }}>
          <div className="hero-slide-overlay" style={{ background: 'rgba(0,0,0,0.6)' }}></div>
          <div className="hero-slide-content">
            <div className="container text-center">
              <h1 className="display-4 fw-bold font-serif text-white">Dhampus Travel Guide</h1>
              <p className="fs-5 text-white fw-light mt-3">Find the best Dhampus Guest House and Accommodation.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-12 text-center mb-5">
              <h2 className="display-6 font-serif fw-bold" style={{ color: 'var(--text-primary)' }}>Best Hotel in Dhampus</h2>
              <div className="gold-accent-line mx-auto"></div>
              <p className="mt-4 lh-lg text-secondary">
                Dhampus is a legendary gateway to the Annapurna region. While there are many options for a <strong>Stay in Dhampus</strong>, trekkers often prefer continuing slightly further up the ridge to Deurali for a quieter, more majestic mountain view. 
              </p>
            </div>
          </div>

          <div className="row g-5 align-items-center">
            <div className="col-md-6 order-md-2">
              <img src="/uploads/image.png" alt="Dhampus Accommodation" className="img-fluid rounded shadow-sm" />
            </div>
            <div className="col-md-6 order-md-1">
              <h3 className="font-serif fw-bold mb-3">Lodge Near Dhampus</h3>
              <p className="lh-lg text-secondary mb-4">
                If you are looking for a <strong>Mountain View Hotel Dhampus</strong> or a family stay, New Pittam Deurali Guest House is located just an hour's scenic walk past Dhampus village. It offers the perfect <strong>Overnight Stay in Dhampus</strong> region, away from the crowds.
              </p>
              <ul className="list-unstyled lh-lg text-secondary">
                <li><i className="bi bi-star-fill text-warning me-2"></i> Unobstructed Himalayan Panoramas</li>
                <li><i className="bi bi-star-fill text-warning me-2"></i> Budget Hotel Dhampus Alternatives</li>
                <li><i className="bi bi-star-fill text-warning me-2"></i> Authentic Nepalese Dining</li>
              </ul>
              <Link to="/booking" className="btn btn-primary fw-bold px-4 py-2 mt-3">Make a Hotel Reservation</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DhampusGuide;

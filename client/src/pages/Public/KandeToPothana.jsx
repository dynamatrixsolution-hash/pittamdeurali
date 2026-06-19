import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';

const KandeToPothana = () => {
  return (
    <div className="fade-in-up">
      <SEO 
        title="Kande to Pothana Trek Guide | Accommodation & Guest House"
        description="Planning your trek from Kande to Pothana? Book the best trekking lodge near Kande. Explore budget accommodation and family stays."
        keywords={[
          "Kande Accommodation", "Kande Guest House", "Kande Trekking Lodge",
          "Hotel Near Kande", "Stay Near Kande", "Best Accommodation Between Kande and Forest Camp"
        ]}
        slug="/kande-to-pothana-trek-guide"
      />

      <section className="hero-slider" style={{ height: '50vh', minHeight: '400px' }}>
        <div className="hero-slide active" style={{ backgroundImage: `url('/uploads/image copy 6.png')` }}>
          <div className="hero-slide-overlay" style={{ background: 'rgba(0,0,0,0.6)' }}></div>
          <div className="hero-slide-content">
            <div className="container text-center">
              <h1 className="display-4 fw-bold font-serif text-white">Kande to Pothana Trek Guide</h1>
              <p className="fs-5 text-white fw-light mt-3">The Best Accommodation Between Kande and Forest Camp</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container text-center">
          <h2 className="display-6 font-serif fw-bold mb-4" style={{ color: 'var(--text-primary)' }}>Stay Near Kande</h2>
          <div className="gold-accent-line mx-auto mb-5"></div>
          <p className="lh-lg text-secondary mx-auto" style={{ maxWidth: '800px' }}>
            The trek from Kande is the most popular starting point for the Mardi Himal trek. Instead of booking a <strong>Kande Guest House</strong> right at the highway, most trekkers prefer hiking up to Deurali for their first night. New Pittam Deurali Guest House is the highly recommended <strong>Kande Trekking Lodge</strong> alternative, offering fresh mountain air, pristine views, and absolute silence away from the road.
          </p>
          
          <Link to="/booking" className="btn btn-primary fw-bold px-4 py-2 mt-4">Book Accommodation Now</Link>
        </div>
      </section>
    </div>
  );
};

export default KandeToPothana;

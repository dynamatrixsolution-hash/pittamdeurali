import React from 'react';

const About = () => {
  return (
    <div className="container py-5 fade-in-up">
      <div className="row justify-content-center text-center mb-5">
        <div className="col-lg-8">
          <h6 className="text-uppercase fw-semibold" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em', fontSize: '0.75rem' }}>
            About Us
          </h6>
          <h1 className="display-4 font-serif fw-bold my-2 text-white">Our Design & Philosophy</h1>
          <div className="gold-accent-line"></div>
          <p className="lead text-secondary" style={{ fontSize: '1rem' }}>
            Sanctum Retreat Pokhara was established to redefine luxury in Nepal—shifting the focus from grand excessive displays to natural, organic stillness.
          </p>
        </div>
      </div>

      {/* Main Philosophy Row */}
      <div className="row align-items-center g-5 mb-5">
        <div className="col-md-6">
          <img 
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80" 
            alt="Organic Architecture" 
            className="img-fluid w-100"
            style={{ objectFit: 'cover', height: '360px', border: '1px solid var(--border-color)', borderRadius: '4px' }}
          />
        </div>
        <div className="col-md-6">
          <h3 className="font-serif fw-bold mb-3" style={{ color: 'var(--color-gold)' }}>Aman-Inspired Boutique Architecture</h3>
          <p className="lh-lg text-secondary" style={{ fontSize: '0.9rem' }}>
            Inspired by the clean lines of Aman resorts and the warm comfort of Airbnb spaces, Sanctum Retreat integrates Gurung dry stone craftsmanship with modern minimalist steel-framed glass. 
          </p>
          <p className="lh-lg text-secondary" style={{ fontSize: '0.9rem' }}>
            Every building is built to allow natural light to flow uninterrupted while framing the majesty of Mount Machapuchare (Fishtail). The slate floor tiling retains mountain warmth, while custom timber structures reflect the ancient lakeside forests of Pokhara.
          </p>
        </div>
      </div>

      {/* Second Row - Lakeside Integration */}
      <div className="row align-items-center g-5 flex-md-row-reverse mb-5">
        <div className="col-md-6">
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80" 
            alt="Wellness Hall" 
            className="img-fluid w-100"
            style={{ objectFit: 'cover', height: '360px', border: '1px solid var(--border-color)', borderRadius: '4px' }}
          />
        </div>
        <div className="col-md-6">
          <h3 className="font-serif fw-bold mb-3" style={{ color: 'var(--color-gold)' }}>The Pure Sanctum Way</h3>
          <p className="lh-lg text-secondary" style={{ fontSize: '0.9rem' }}>
            We believe that wellness is not a package, but a constant state of being. That is why our retreat operates in harmony with the local Pokhara community:
          </p>
          <ul className="text-secondary lh-lg d-flex flex-column gap-2 small">
            <li><strong>Farm-to-Table Dining:</strong> 80% of our ingredients are sourced locally from Lakeside farm cooperatives.</li>
            <li><strong>Zero Single-Use Plastics:</strong> We utilize copper and glass storage, purified mountain spring water, and bamboo amenities.</li>
            <li><strong>Holistic Therapies:</strong> Our Ayurvedic massages feature wild mountain oils harvested and pressed by hand.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;

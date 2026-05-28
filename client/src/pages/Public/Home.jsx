import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const Home = () => {
  const [cms, setCms] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [services, setServices] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cmsRes, roomsRes, servicesRes, experiencesRes, testimonialsRes] = await Promise.all([
          api.get('/cms/homepage'),
          api.get('/rooms'),
          api.get('/services'),
          api.get('/experiences'),
          api.get('/testimonials?approvedOnly=true')
        ]);

        if (cmsRes.success) setCms(cmsRes.data);
        if (roomsRes.success) setRooms(roomsRes.data.filter(r => r.featured)); 
        if (servicesRes.success) setServices(servicesRes.data.slice(0, 4)); 
        if (experiencesRes.success) setExperiences(experiencesRes.data.slice(0, 3)); 
        if (testimonialsRes.success) setTestimonials(testimonialsRes.data.slice(0, 3)); 
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh', color: 'var(--color-gold)' }}>
        <div className="spinner-border spinner-luxury" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Get hero data with fallbacks
  const hero = cms?.hero || {
    title: 'Unveil Pure Sanctuary',
    subtitle: 'Experience the heights of luxury coexisting with the wild majesty of Pokhara\'s lakes and peaks.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80',
    buttonText: 'Explore Rooms',
    buttonLink: '/rooms'
  };

  // Get welcome data with fallbacks
  const welcome = cms?.welcome || {
    title: 'Welcome to Sanctum Retreat',
    subtitle: 'A Symphony of Stone, Water, and Himalayan Sky',
    description: 'Nestled on the serene edges of Phewa Lake, Sanctum Retreat represents the pinnacle of modern organic luxury. Our architecture integrates sustainable local slate and timber...',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'
  };

  const getAPIImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url}`;
  };

  return (
    <div className="fade-in-up">
      {/* Hero Section */}
      <section 
        className="hero-fullscreen" 
        style={{ backgroundImage: `url(${getAPIImageUrl(hero.image)})` }}
      >
        <div className="hero-overlay"></div>
        <div className="container position-relative text-center text-white" style={{ zIndex: 2 }}>
          <div className="row justify-content-center">
            <div className="col-lg-8 col-11">
              <h1 className="display-4 fw-bold mb-4 font-serif" style={{ color: 'var(--text-primary)' }}>{hero.title}</h1>
              <p className="fs-6 mb-5 lh-lg" style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300, maxWidth: '600px', margin: '0 auto 40px' }}>
                {hero.subtitle}
              </p>
              <Link to={hero.buttonLink || '/rooms'} className="btn btn-luxury">
                {hero.buttonText}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h6 className="text-uppercase fw-semibold" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em', fontSize: '0.75rem' }}>
                {welcome.subtitle}
              </h6>
              <h2 className="display-6 font-serif fw-bold my-3" style={{ color: 'var(--text-primary)' }}>
                {welcome.title}
              </h2>
              <div className="gold-accent-line left"></div>
              <p className="lh-lg text-secondary my-4" style={{ textAlign: 'justify', fontSize: '0.9rem' }}>
                {welcome.description}
              </p>
              <Link to="/about" className="btn btn-luxury-outline mt-2">
                About Us
              </Link>
            </div>
            <div className="col-lg-6">
              <div style={{ border: '1px solid var(--border-color)', padding: '12px' }}>
                <img 
                  src={getAPIImageUrl(welcome.image)} 
                  alt="Welcome Retreat" 
                  className="img-fluid w-100"
                  style={{ objectFit: 'cover', height: '400px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container text-center">
          <h6 className="text-uppercase fw-semibold" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em', fontSize: '0.75rem' }}>
            Sanctuary Chambers
          </h6>
          <h2 className="display-6 font-serif fw-bold my-2" style={{ color: 'var(--text-primary)' }}>
            {cms?.roomsSection?.title || 'Sanctuary Chambers'}
          </h2>
          <p className="small text-secondary mb-4" style={{ letterSpacing: '0.02em' }}>
            {cms?.roomsSection?.subtitle || 'Quiet spaces of stone and silk with private heated pools and unrestricted lake views.'}
          </p>
          <div className="gold-accent-line"></div>

          <div className="row g-4 justify-content-center text-start mt-4">
            {rooms.map(room => (
              <div className="col-lg-4 col-md-6" key={room._id}>
                <div className="card-luxury h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div style={{ height: '240px', overflow: 'hidden' }}>
                      <img 
                        src={getAPIImageUrl(room.images[0])} 
                        className="w-100 h-100" 
                        style={{ objectFit: 'cover' }} 
                        alt={room.title}
                      />
                    </div>
                    <div className="p-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h4 className="font-serif mb-0 fs-5" style={{ color: 'var(--text-primary)' }}>{room.title}</h4>
                        <span className="fw-bold fs-6" style={{ color: 'var(--color-gold)' }}>${room.price}</span>
                      </div>
                      <p className="small text-secondary mb-3 lh-lg">{room.shortDescription}</p>
                      
                      <div className="d-flex flex-wrap gap-1 border-top pt-3" style={{ borderColor: 'var(--border-color)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <span className="me-3"><i className="bi bi-people me-1"></i> {room.capacity} Guests</span>
                        <span><i className="bi bi-arrows-fullscreen me-1"></i> {room.roomSize}</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <Link to={`/rooms/${room.slug}`} className="btn btn-luxury-outline w-100 py-2 text-center text-decoration-none">
                      Explore Room
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container text-center">
          <h6 className="text-uppercase fw-semibold" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em', fontSize: '0.75rem' }}>
            Curated Amenities
          </h6>
          <h2 className="display-6 font-serif fw-bold my-2" style={{ color: 'var(--text-primary)' }}>
            {cms?.servicesSection?.title || 'Curated Amenities'}
          </h2>
          <p className="small text-secondary mb-4">
            {cms?.servicesSection?.subtitle || 'Designed to rejuvenate mind, body, and spirit.'}
          </p>
          <div className="gold-accent-line"></div>

          <div className="row g-4 mt-4">
            {services.map(service => (
              <div className="col-lg-3 col-md-6" key={service._id}>
                <div className="card-luxury p-4 h-100 d-flex flex-column align-items-center">
                  <div className="fs-2 mb-3" style={{ color: 'var(--color-gold)' }}>
                    <i className={`bi ${service.icon}`}></i>
                  </div>
                  <h5 className="font-serif fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>{service.title}</h5>
                  <p className="small text-secondary mb-0 lh-lg">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experiences Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container text-center">
          <h6 className="text-uppercase fw-semibold" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em', fontSize: '0.75rem' }}>
            Pokhara Excursions
          </h6>
          <h2 className="display-6 font-serif fw-bold my-2" style={{ color: 'var(--text-primary)' }}>
            {cms?.experiencesSection?.title || 'Pokhara Excursions'}
          </h2>
          <p className="small text-secondary mb-4">
            {cms?.experiencesSection?.subtitle || 'Bespoke adventures curated by our expert local guides.'}
          </p>
          <div className="gold-accent-line"></div>

          <div className="row g-4 text-start mt-4 justify-content-center">
            {experiences.map(exp => (
              <div className="col-lg-4 col-md-6" key={exp._id}>
                <div className="card-luxury h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div style={{ height: '220px', overflow: 'hidden' }}>
                      <img 
                        src={getAPIImageUrl(exp.image)} 
                        className="w-100 h-100" 
                        style={{ objectFit: 'cover' }} 
                        alt={exp.title}
                      />
                    </div>
                    <div className="p-4">
                      <h5 className="font-serif mb-2" style={{ color: 'var(--text-primary)' }}>{exp.title}</h5>
                      <p className="small text-secondary lh-lg mb-0">{exp.description}</p>
                    </div>
                  </div>
                  
                  <div className="px-4 pb-4">
                    <div className="d-flex justify-content-between align-items-center border-top pt-3" style={{ borderColor: 'var(--border-color)' }}>
                      <span className="small text-secondary">Inquiry price from</span>
                      <span className="fw-bold text-white">${exp.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container text-center">
          <h6 className="text-uppercase fw-semibold" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em', fontSize: '0.75rem' }}>
            Guest Journals
          </h6>
          <h2 className="display-6 font-serif fw-bold my-2" style={{ color: 'var(--text-primary)' }}>
            {cms?.testimonialsSection?.title || 'Guest Journals'}
          </h2>
          <div className="gold-accent-line"></div>

          <div className="row g-4 justify-content-center mt-4">
            {testimonials.map(item => (
              <div className="col-lg-5" key={item._id}>
                <div className="testimonial-card h-100 d-flex flex-column justify-content-between">
                  <div>
                    <img src={getAPIImageUrl(item.guestImage)} alt={item.guestName} className="testimonial-avatar" />
                    <p className="fst-italic lh-lg text-secondary small">
                      "{item.reviewText}"
                    </p>
                  </div>
                  <div className="mt-3">
                    <div className="mb-1" style={{ color: 'var(--color-gold)' }}>
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <i className="bi bi-star-fill me-1" key={i}></i>
                      ))}
                    </div>
                    <h6 className="mb-0 fw-bold" style={{ color: 'var(--text-primary)' }}>{item.guestName}</h6>
                    <span className="small text-secondary">{item.country}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="text-center">
            <h6 className="text-uppercase fw-semibold" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em', fontSize: '0.75rem' }}>
              FAQ
            </h6>
            <h2 className="display-6 font-serif fw-bold my-2" style={{ color: 'var(--text-primary)' }}>
              Frequently Asked Questions
            </h2>
            <div className="gold-accent-line"></div>
          </div>

          <div className="row justify-content-center mt-5">
            <div className="col-lg-8 col-11">
              <div className="accordion accordion-flush" id="faqAccordion">
                {(cms?.faqs || []).map((faq, index) => (
                  <div 
                    className="accordion-item mb-3" 
                    key={faq._id || index}
                    style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                  >
                    <h2 className="accordion-header" id={`flush-heading${index}`}>
                      <button 
                        className="accordion-button collapsed font-serif shadow-none" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target={`#flush-collapse${index}`} 
                        aria-expanded="false" 
                        aria-controls={`flush-collapse${index}`}
                        style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '1rem', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}
                      >
                        {faq.question}
                      </button>
                    </h2>
                    <div 
                      id={`flush-collapse${index}`} 
                      className="accordion-collapse collapse" 
                      aria-labelledby={`flush-heading${index}`} 
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body small lh-lg" style={{ color: 'var(--text-secondary)' }}>
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

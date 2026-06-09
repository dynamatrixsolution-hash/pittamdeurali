import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { getAPIImageUrl } from '../../services/api';
import WeatherWidget from '../../components/WeatherWidget';
import weatherBg from '../../assets/weather-bg.png';
import trekMap from '../../assets/trek-map.jpg';
import SEO from '../../components/SEO';

const getCountryFlag = (country) => {
  if (!country) return '';
  const countryName = country.trim().toLowerCase();
  switch (countryName) {
    case 'nepal': return '🇳🇵';
    case 'india': return '🇮🇳';
    case 'united states':
    case 'usa':
    case 'us':
      return '🇺🇸';
    case 'united kingdom':
    case 'uk':
    case 'england':
      return '🇬🇧';
    case 'australia': return '🇦🇺';
    case 'canada': return '🇨🇦';
    case 'germany': return '🇩🇪';
    case 'france': return '🇫🇷';
    case 'china': return '🇨🇳';
    case 'japan': return '🇯🇵';
    case 'netherlands': return '🇳🇱';
    case 'spain': return '🇪🇸';
    case 'switzerland': return '🇨🇭';
    case 'singapore': return '🇸🇬';
    case 'new zealand': return '🇳🇿';
    case 'poland': return '🇵🇱';
    case 'italy': return '🇮🇹';
    case 'south korea': return '🇰🇷';
    case 'sweden': return '🇸🇪';
    case 'norway': return '🇳🇴';
    case 'denmark': return '🇩🇰';
    case 'finland': return '🇫🇮';
    case 'austria': return '🇦🇹';
    case 'belgium': return '🇧🇪';
    case 'ireland': return '🇮🇪';
    case 'malaysia': return '🇲🇾';
    case 'thailand': return '🇹🇭';
    case 'brazil': return '🇧🇷';
    case 'argentina': return '🇦🇷';
    case 'mexico': return '🇲🇽';
    case 'south africa': return '🇿🇦';
    case 'israel': return '🇮🇱';
    case 'uae': return '🇦🇪';
    default: return '🏳️';
  }
};

const Home = () => {
  const [cms, setCms] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [settings, setSettings] = useState(null);
  const [heroes, setHeroes] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(window.innerWidth < 768 ? 1 : 2);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerSlide(window.innerWidth < 768 ? 1 : 2);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxReviewIndex = Math.max(0, testimonials.length - itemsPerSlide);

  useEffect(() => {
    if (testimonials.length <= itemsPerSlide) return;
    const interval = setInterval(() => {
      setCurrentReviewIndex(prev => {
        return prev >= maxReviewIndex ? 0 : prev + 1;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length, itemsPerSlide, maxReviewIndex]);

  const handlePrevReview = () => {
    setCurrentReviewIndex(prev => (prev > 0 ? prev - 1 : maxReviewIndex));
  };

  const handleNextReview = () => {
    setCurrentReviewIndex(prev => (prev < maxReviewIndex ? prev + 1 : 0));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cmsRes, roomsRes, galleryRes, testimonialsRes, settingsRes, heroesRes, restaurantRes] = await Promise.all([
          api.get('/cms/homepage'),
          api.get('/rooms'),
          api.get('/gallery'),
          api.get('/reviews/approved'),
          api.get('/settings'),
          api.get('/heroes'),
          api.get('/restaurant')
        ]);

        if (cmsRes.success) setCms(cmsRes.data);
        if (roomsRes.success) setRooms(roomsRes.data.filter(r => r.featured));
        if (galleryRes.success) setGallery(galleryRes.data.slice(0, 6)); // Display up to 6 gallery images
        if (testimonialsRes.success) setTestimonials(testimonialsRes.data.slice(0, 10));
        if (settingsRes.success) setSettings(settingsRes.data);
        if (heroesRes.success) setHeroes(heroesRes.data);
        if (restaurantRes.success) setRestaurant(restaurantRes.data);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  // Set up active slides from database or fall back to default slideshow
  const activeSlides = heroes
    .filter(h => h.active)
    .map(h => ({
      title: h.title,
      subtitle: h.subtitle,
      image: h.imageUrl,
      buttonText: h.buttonText,
      buttonLink: h.buttonLink
    }));
  const defaultSlides = [
    {
      title: 'Experience Authentic Hospitality in Deurali',
      subtitle: 'Enjoy cozy wooden rooms, hot showers, and friendly local family hospitality in Kaski.',
      image: '/uploads/image.png',
      buttonText: 'Explore Rooms',
      buttonLink: '/rooms'
    },
    {
      title: 'Traditional Wood-fired Kitchen',
      subtitle: 'Savor organic local Dal Bhat, handmade dumplings, and fresh mountain teas.',
      image: '/uploads/image copy 6.png',
      buttonText: 'View Food Menu',
      buttonLink: '/restaurant'
    },
    {
      title: 'Breathtaking Himalayan Vistas',
      subtitle: 'Wake up to direct sunrise views of the majestic Annapurna and Dhaulagiri ranges.',
      image: '/uploads/image copy 8.png',
      buttonText: 'View Gallery',
      buttonLink: '/gallery'
    }
  ];

  const slidesToRender = activeSlides.length > 0 ? activeSlides : defaultSlides;

  // Auto sliding timer
  useEffect(() => {
    if (slidesToRender.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % slidesToRender.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slidesToRender.length]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh', color: 'var(--color-gold)' }}>
        <div className="spinner-border spinner-luxury" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const handlePrevSlide = (e) => {
    e.stopPropagation();
    setCurrentSlideIndex(prev => (prev - 1 + slidesToRender.length) % slidesToRender.length);
  };

  const handleNextSlide = (e) => {
    e.stopPropagation();
    setCurrentSlideIndex(prev => (prev + 1) % slidesToRender.length);
  };

  // Get welcome data with fallbacks
  const welcome = cms?.welcome || {
    title: 'Welcome to New Pittam Deurali',
    subtitle: 'Authentic Nepali Hospitality & Cozy Mountain Lodging',
    description: 'Nestled in the beautiful ridge-top village of Pitam Deurali, our family-run guest house and restaurant serves as a warm, welcoming stopover for trekkers, families, and tourists. Enjoy our comfortable rooms, authentic homemade Nepali meals, and breathtaking views of the Annapurna and Dhaulagiri mountain ranges.',
    image: '/uploads/image copy.png'
  };

  return (
    <div className="fade-in-up">
      <SEO 
        title="Pitam Deurali Guest House | Mountain Lodge in Pothana"
        description="Stay at Pitam Deurali Guest House in Pothana. Enjoy stunning Himalayan views, cozy rooms, and delicious local food near Mardi Himal Trek and Dhampus."
        keywords={[
          "Pitam Deurali Guest House", "Pothana Guest House", "Deurali Guest House", "Hotel in Pothana", 
          "Stay in Pothana", "Guest House near Mardi Himal Trek", "Mardi Himal Accommodation", 
          "Annapurna Trek Lodge", "Trekking Lodge Nepal", "Hotel near Australian Camp", 
          "Pokhara Trekking Stay", "Mountain View Hotel Pokhara", "Dhampus Village Stay", 
          "Annapurna Conservation Area Lodge", "Kaski Nepal Lodge", "Gandaki Province Trekking Stay", 
          "Budget Hotel Dhampus", "Himalayan View Accommodation", "Family Guest House Nepal", 
          "Trekker Friendly Lodge"
        ]}
        slug="/"
      />
      {/* 1. Hero Slideshow Section */}
      <section className="hero-slider">
        {slidesToRender.map((slide, idx) => (
          <div
            key={idx}
            className={`hero-slide ${idx === currentSlideIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${getAPIImageUrl(slide.image)})` }}
          >
            <div className="hero-slide-overlay"></div>
            <div className="hero-slide-content">
              <div className="container text-center">
                <div className="row justify-content-center">
                  <div className="col-lg-10 col-12">
                    <h1 className="display-4 fw-bold mb-4 font-serif text-white px-2 hero-text-force-white" style={{ lineHeight: '1.2', textShadow: '1px 1px 6px rgba(0,0,0,0.7)' }}>
                      {slide.title}
                    </h1>
                    <p className="fs-6 mb-5 lh-lg px-3 text-white hero-text-force-white" style={{ fontWeight: 300, maxWidth: '700px', margin: '0 auto 40px', textShadow: '1px 1px 6px rgba(0,0,0,0.7)' }}>
                      {slide.subtitle}
                    </p>
                    <Link to={slide.buttonLink || '/rooms'} className="btn btn-orange py-3 px-5">
                      {slide.buttonText || 'Explore'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Previous/Next Navigation Arrows */}
        {slidesToRender.length > 1 && (
          <>
            <button
              className="hero-arrow hero-arrow-left"
              onClick={handlePrevSlide}
              aria-label="Previous Slide"
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <button
              className="hero-arrow hero-arrow-right"
              onClick={handleNextSlide}
              aria-label="Next Slide"
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </>
        )}

        {/* Dot Indicators */}
        {slidesToRender.length > 1 && (
          <ul className="hero-dots">
            {slidesToRender.map((_, idx) => (
              <li key={idx}>
                <button
                  className={`hero-dot ${idx === currentSlideIndex ? 'active' : ''}`}
                  onClick={() => setCurrentSlideIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                ></button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 2. Welcome Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 col-12">
              <h6 className="text-uppercase fw-semibold" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em', fontSize: '0.75rem' }}>
                {welcome.subtitle}
              </h6>
              <h2 className="display-6 font-serif fw-bold my-3" style={{ color: 'var(--text-primary)' }}>
                {welcome.title}
              </h2>
              <div className="gold-accent-line left"></div>
              <p className="lh-lg text-secondary my-4" style={{ textAlign: 'justify', fontSize: '0.95rem' }}>
                {welcome.description}
              </p>
              <Link to="/about" className="btn btn-blue-outline mt-2">
                Our Story
              </Link>
            </div>
            <div className="col-lg-6 col-12">
              <div style={{ border: '1px solid var(--border-color)', padding: '12px', borderRadius: '4px' }}>
                <img
                  src={getAPIImageUrl(welcome.image)}
                  alt="Welcome New Pittam Deurali"
                  className="img-fluid w-100"
                  style={{ objectFit: 'cover', height: '400px', borderRadius: '2px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Weather Section */}
      <section 
        className="section-padding position-relative overflow-hidden weather-section-dark-override" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(18, 18, 20, 0.75), rgba(18, 18, 20, 0.75)), url(${weatherBg})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          borderBottom: '1px solid var(--border-color)' 
        }}
      >
        <div className="container">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-8 col-11">
              <h6 className="text-uppercase fw-semibold" style={{ color: '#ffffff', letterSpacing: '0.15em', fontSize: '0.75rem' }}>
                Climate & Weather
              </h6>
              <h2 className="display-6 font-serif fw-bold my-2" style={{ color: '#ffffff' }}>
                Live Pitam Deurali Weather
              </h2>
              <div className="gold-accent-line" style={{ backgroundColor: '#FBBF24' }}></div>
              <p className="small mb-4" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                Real-time meteorological conditions and 5-day mountain weather forecasts directly from the viewpoint summit (~2,100m).
              </p>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-10 col-12">
              <WeatherWidget />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Accommodation Features */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container text-center">
          <h6 className="text-uppercase fw-semibold" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em', fontSize: '0.75rem' }}>
            Rooms & Lodging
          </h6>
          <h2 className="display-6 font-serif fw-bold my-2" style={{ color: 'var(--text-primary)' }}>
            {cms?.roomsSection?.title || 'Comfortable Accommodations'}
          </h2>
          <p className="small text-secondary mb-4">
            {cms?.roomsSection?.subtitle || 'Warm wooden rooms with comfortable beds, hot showers, and forest/mountain views.'}
          </p>
          <div className="gold-accent-line"></div>

          <div className="row g-4 justify-content-center text-start mt-4">
            {rooms.map(room => (
              <div className="col-lg-4 col-md-6 col-12" key={room._id}>
                <div className="card-luxury h-100 d-flex flex-column">
                  <div style={{ height: '240px', overflow: 'hidden', flexShrink: 0 }}>
                    <img
                      src={getAPIImageUrl(room.images[0])}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                      alt={room.title}
                    />
                  </div>

                  <div className="p-4 d-flex flex-column flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-3" style={{ minHeight: '56px' }}>
                      <h4 className="font-serif mb-0 fs-5 text-white" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{room.title}</h4>
                      {settings?.showRoomPricesPublicly ? (
                        <span className="fw-bold fs-6 text-nowrap" style={{ color: 'var(--color-gold)' }}>${room.price} <span className="small text-secondary fw-normal">/ night</span></span>
                      ) : (
                        <span className="small text-gold fw-semibold text-nowrap">
                          <a
                            href={`https://wa.me/${settings?.whatsappNumber ? settings.whatsappNumber.replace(/[+\s-]/g, '') : '9779801234567'}?text=Hi,%20I'm%20interested%20in%20the%20price%20and%20booking%20of%20the%20${encodeURIComponent(room.title)}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none text-gold d-inline-flex align-items-center"
                            style={{ color: 'var(--color-gold)' }}
                            onClick={e => e.stopPropagation()}
                          >
                            Contact <i className="bi bi-whatsapp ms-1 text-success"></i>
                          </a>
                        </span>
                      )}
                    </div>

                    <div className="flex-grow-1 mb-3">
                      <p className="small text-secondary lh-lg mb-0" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {room.shortDescription}
                      </p>
                    </div>

                    <div className="d-flex flex-wrap gap-1 border-top pt-3" style={{ borderColor: 'var(--border-color)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <span className="me-3"><i className="bi bi-people me-1"></i> {room.capacity} Guests</span>
                      <span><i className="bi bi-calendar-check me-1"></i> {room.bedType}</span>
                    </div>
                  </div>

                  <div className="px-4 pb-4 mt-auto">
                    <Link to={`/rooms/${room.slug}`} className="btn btn-blue-outline w-100 py-2 text-center text-decoration-none">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Restaurant Features */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 col-12 order-lg-2">
              <h6 className="text-uppercase fw-semibold" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em', fontSize: '0.75rem' }}>
                {restaurant?.subtitle || 'Restaurant & Dining'}
              </h6>
              <h2 className="display-6 font-serif fw-bold my-3">
                {restaurant?.title || 'Authentic Wood-Fire Nepali Cuisine'}
              </h2>
              <div className="gold-accent-line left"></div>
              <p className="lh-lg text-secondary my-4" style={{ fontSize: '0.95rem' }}>
                {restaurant?.description || 'At New Pittam Deurali Restaurant, we believe that good food is essential for any journey. Enjoy traditional Nepalese Dal Bhat cooked on a traditional wood fire, handmade momos, and seasonal vegetable curries using fresh, organic ingredients harvested straight from local farms.'}
              </p>
              <div className="d-flex flex-column gap-2 mb-4">
                {restaurant?.features && restaurant.features.length > 0 ? (
                  restaurant.features.map((feat, idx) => (
                    <span key={idx} className="small text-secondary">
                      <i className="bi bi-check2-circle me-2 text-success"></i> {feat}
                    </span>
                  ))
                ) : (
                  <>
                    <span className="small text-secondary"><i className="bi bi-check2-circle me-2 text-success"></i> Authentic traditional Nepali recipes</span>
                    <span className="small text-secondary"><i className="bi bi-check2-circle me-2 text-success"></i> 100% locally sourced, organic ingredients</span>
                    <span className="small text-secondary"><i className="bi bi-check2-circle me-2 text-success"></i> Warm family operated kitchen & dining</span>
                  </>
                )}
              </div>
              <Link to="/restaurant" className="btn btn-green py-2.5 px-4">
                Explore Dining & Menu
              </Link>
            </div>
            <div className="col-lg-6 col-12 order-lg-1">
              <div className="row g-3">
                {restaurant?.galleryImages && restaurant.galleryImages.length > 0 ? (
                  restaurant.galleryImages.slice(0, 2).map((img, idx) => (
                    <div className="col-6" key={idx}>
                      <img
                        src={getAPIImageUrl(img)}
                        alt="Restaurant representation"
                        className="img-fluid w-100"
                        style={{ objectFit: 'cover', height: '280px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                      />
                    </div>
                  ))
                ) : (
                  <>
                    <div className="col-6">
                      <img
                        src={getAPIImageUrl(restaurant?.coverImage || "/uploads/image copy 6.png")}
                        alt="Dining Area"
                        className="img-fluid w-100"
                        style={{ objectFit: 'cover', height: '280px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                      />
                    </div>
                    <div className="col-6">
                      <img
                        src={getAPIImageUrl("/uploads/image copy 7.png")}
                        alt="Traditional Dal Bhat"
                        className="img-fluid w-100"
                        style={{ objectFit: 'cover', height: '280px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Gallery Preview */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container text-center">
          <h6 className="text-uppercase fw-semibold" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em', fontSize: '0.75rem' }}>
            Visual Showcase
          </h6>
          <h2 className="display-6 font-serif fw-bold my-2">Property Gallery</h2>
          <p className="small text-secondary mb-4">A glimpse of our cozy guest house, local dining, and surrounding mountain trails.</p>
          <div className="gold-accent-line mb-5"></div>

          <div className="row g-3">
            {gallery.map((img, idx) => (
              <div className="col-lg-4 col-md-6 col-12" key={img._id || idx}>
                <div className="gallery-preview-item position-relative overflow-hidden" style={{ height: '240px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                  <img
                    src={getAPIImageUrl(img.url)}
                    alt={img.caption || 'New Pittam Deurali'}
                    className="w-100 h-100"
                    style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <Link to="/gallery" className="btn btn-blue-outline py-2.5 px-4">
              View All Photos
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Why Choose Us */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container text-center">
          <h6 className="text-uppercase fw-semibold" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em', fontSize: '0.75rem' }}>
            Why Choose Us
          </h6>
          <h2 className="display-6 font-serif fw-bold my-2">Nepali Hospitality at Its Best</h2>
          <div className="gold-accent-line mb-5"></div>

          <div className="row g-4 text-start">
            <div className="col-md-4 col-12">
              <div className="card-luxury p-4 h-100">
                <div className="fs-3 mb-3 text-gold" style={{ color: 'var(--color-gold)' }}><i className="bi bi-heart-fill"></i></div>
                <h5 className="font-serif fw-bold mb-2">Family Operated</h5>
                <p className="small text-secondary lh-lg mb-0">
                  Operated by a local family, we treat every guest like our own family. You will experience genuine Nepalese culture, care, and hospitality.
                </p>
              </div>
            </div>
            <div className="col-md-4 col-12">
              <div className="card-luxury p-4 h-100">
                <div className="fs-3 mb-3 text-gold" style={{ color: 'var(--color-gold)' }}><i className="bi bi-shop"></i></div>
                <h5 className="font-serif fw-bold mb-2">Local Ingredients</h5>
                <p className="small text-secondary lh-lg mb-0">
                  Our kitchen focuses on organic farm-to-table cuisine. We harvest vegetables from our own garden and source rice, lentils, and tea locally.
                </p>
              </div>
            </div>
            <div className="col-md-4 col-12">
              <div className="card-luxury p-4 h-100">
                <div className="fs-3 mb-3 text-gold" style={{ color: 'var(--color-gold)' }}><i className="bi bi-compass-fill"></i></div>
                <h5 className="font-serif fw-bold mb-2">Trekking Hub</h5>
                <p className="small text-secondary lh-lg mb-0">
                  Located directly on the Mardi Himal trail, we provide trekking maps, route advice, and guide services to ensure a safe and memorable trek.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Customer Reviews */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-primary)', overflow: 'hidden' }}>
        <div className="container text-center position-relative">
          <h6 className="text-uppercase fw-semibold" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em', fontSize: '0.75rem' }}>
            Testimonials
          </h6>
          <h2 className="display-6 font-serif fw-bold my-2">Traveler Journals</h2>
          <div className="gold-accent-line mb-5"></div>

          <div className="position-relative px-md-5">
            {/* Slider track wrapper */}
            <div style={{ overflow: 'hidden', width: '100%' }}>
              <div 
                className="d-flex" 
                style={{ 
                  transform: `translateX(-${currentReviewIndex * (100 / itemsPerSlide)}%)`, 
                  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  width: '100%'
                }}
              >
                {testimonials.map(item => (
                  <div 
                    key={item._id} 
                    style={{ 
                      flex: `0 0 ${100 / itemsPerSlide}%`,
                      width: `${100 / itemsPerSlide}%`,
                      padding: '0 12px',
                      boxSizing: 'border-box' 
                    }}
                  >
                    <div className="testimonial-card h-100 d-flex flex-column justify-content-between p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '4px', textAlign: 'left' }}>
                      <div>
                        <p className="fst-italic lh-lg text-secondary small">
                          "{item.review}"
                        </p>
                      </div>
                      <div className="mt-3 d-flex align-items-center gap-3">
                        <img
                          src={getAPIImageUrl(item.image) || 'https://img.icons8.com/office/40/user.png'}
                          alt={item.guestName}
                          className="rounded-circle"
                          style={{ width: '50px', height: '50px', objectFit: 'cover', border: '1px solid var(--color-gold)' }}
                        />
                        <div className="text-start">
                          <h6 className="mb-0 fw-bold">{item.guestName}</h6>
                          <span className="small text-muted d-flex align-items-center gap-1.5" style={{ display: 'inline-flex', gap: '6px' }}>
                            <span style={{ fontSize: '1.1rem', lineHeight: '1' }}>{getCountryFlag(item.country)}</span> {item.country}
                          </span>
                          <div className="mt-1" style={{ color: 'var(--color-gold)', fontSize: '0.75rem' }}>
                            {Array.from({ length: item.rating }).map((_, i) => (
                              <i className="bi bi-star-fill me-1" key={i}></i>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider arrows */}
            {testimonials.length > itemsPerSlide && (
              <>
                <button
                  onClick={handlePrevReview}
                  className="btn btn-blue-outline d-none d-md-flex align-items-center justify-content-center"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '-20px',
                    transform: 'translateY(-50%)',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    padding: 0,
                    zIndex: 10
                  }}
                  aria-label="Previous Review"
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
                <button
                  onClick={handleNextReview}
                  className="btn btn-blue-outline d-none d-md-flex align-items-center justify-content-center"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '-20px',
                    transform: 'translateY(-50%)',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    padding: 0,
                    zIndex: 10
                  }}
                  aria-label="Next Review"
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </>
            )}
          </div>

          {/* Dots Indicator */}
          {testimonials.length > itemsPerSlide && (
            <div className="d-flex justify-content-center gap-2 mt-4">
              {Array.from({ length: maxReviewIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentReviewIndex(idx)}
                  className={`hero-dot ${idx === currentReviewIndex ? 'active' : ''}`}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: idx === currentReviewIndex ? 'var(--color-gold)' : 'var(--border-color)',
                    border: 'none',
                    padding: 0,
                    transition: 'var(--transition-smooth)'
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trekking Route Map Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-8 col-11">
              <h6 className="text-uppercase fw-semibold" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em', fontSize: '0.75rem' }}>
                Explore Routes
              </h6>
              <h2 className="display-6 font-serif fw-bold my-2" style={{ color: 'var(--text-primary)' }}>
                Trekking Routes & Approach Maps
              </h2>
              <div className="gold-accent-line"></div>
              <p className="small text-secondary mb-4">
                Two scenic approach routes from Pokhara converge at Pothana and continue together to New Pittam Deurali Guest House & Restaurant and Deurali. From Deurali, the trek continues onward toward Mardi Himal or Annapurna Base Camp.
              </p>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-10 col-12 text-center">
              <div style={{ border: '1px solid var(--border-color)', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-card)' }}>
                <img
                  src={trekMap}
                  alt="Trekking Routes Approach Map"
                  className="img-fluid w-100"
                  style={{ objectFit: 'contain', borderRadius: '4px', maxHeight: '650px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Contact CTA */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="p-5 text-center position-relative overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
            <h6 className="text-uppercase fw-semibold" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em', fontSize: '0.75rem' }}>
              Plan Your Visit
            </h6>
            <h2 className="display-5 font-serif fw-bold my-3">Are You Ready to Experience Pitam Deurali?</h2>
            <p className="small text-secondary mx-auto mb-4" style={{ maxWidth: '600px' }}>
              Have questions about lodging availability, dining bookings, or trail conditions? Get in touch with us directly via phone, email, or WhatsApp.
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
              <a
                href={`https://wa.me/${settings?.whatsappNumber ? settings.whatsappNumber.replace(/[+\s-]/g, '') : '9779801234567'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success py-2.5 px-4 d-flex align-items-center gap-2"
                style={{ border: 'none' }}
              >
                <i className="bi bi-whatsapp"></i> Chat on WhatsApp
              </a>
              <Link to="/contact" className="btn btn-blue py-2.5 px-4">
                Contact Us Form
              </Link>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Pitam+Deurali+Guest+House+and+Restaurant+Lumle+Nepal"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-orange text-white text-decoration-none"
                style={{ fontSize: '0.75rem' }}
              >
                <i className="bi bi-map-fill me-1"></i> Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

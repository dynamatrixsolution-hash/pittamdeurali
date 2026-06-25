import { useState, useEffect } from 'react';
import api, { getAPIImageUrl } from '../../services/api';
import SEO from '../../components/SEO';

const loadPannellum = () => {
  if (window.pannellum) {
    return Promise.resolve();
  }

  if (window.__pannellumLoader) {
    return window.__pannellumLoader;
  }

  window.__pannellumLoader = new Promise((resolve, reject) => {
    if (!document.querySelector('link[data-pannellum="true"]')) {
      const stylesheet = document.createElement('link');
      stylesheet.rel = 'stylesheet';
      stylesheet.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
      stylesheet.dataset.pannellum = 'true';
      document.head.appendChild(stylesheet);
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });

  return window.__pannellumLoader;
};

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Main Tabs: 'photos' | '360'
  const [activeTab, setActiveTab] = useState('photos');

  // Subcategory for Photos tab
  const [photoCategory, setPhotoCategory] = useState('All');

  // Active Panorama for 360 view
  const [activePano, setActivePano] = useState(null);
  const [pannellumReady, setPannellumReady] = useState(false);

  // Lightbox navigation state for traditional photos
  const [lightboxActive, setLightboxActive] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Swipe detection
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const categories = ['Guest House', 'Rooms', 'Restaurant', 'Surroundings', 'Facilities'];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get('/gallery');
        if (res.success) {
          setImages(res.data);
          
          // Set initial active panorama if 360 views exist
          const panos = res.data.filter(img => img.category === '360 View');
          if (panos.length > 0) {
            setActivePano(panos[0]);
          }
        }
      } catch (err) {
        console.error('Error loading gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);


  // Traditional Photos filtered
  const traditionalImages = images.filter(img => img.category !== '360 View');
  const filteredTraditional = photoCategory === 'All' 
    ? traditionalImages 
    : traditionalImages.filter(img => img.category === photoCategory);

  // 360 Panoramas filtered
  const panoramas = images.filter(img => img.category === '360 View');

  useEffect(() => {
    if (activeTab !== '360') return;

    let cancelled = false;
    loadPannellum()
      .then(() => {
        if (!cancelled) {
          setPannellumReady(true);
        }
      })
      .catch((err) => {
        console.error('Error loading Pannellum:', err);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  // Initialize Pannellum
  useEffect(() => {
    if (activeTab === '360' && activePano && pannellumReady) {
      const container = document.getElementById('panorama-viewer');
      if (container && window.pannellum) {
        container.innerHTML = ''; // Clear previous elements
        try {
          const viewer = window.pannellum.viewer('panorama-viewer', {
            type: 'equirectangular',
            panorama: getAPIImageUrl(activePano.url),
            autoLoad: true,
            mouseZoom: true,
            showControls: true
          });
          return () => {
            try {
              viewer.destroy();
            } catch {
              // ignore destroy errors
            }
          };
        } catch (err) {
          console.error('Error initializing Pannellum:', err);
        }
      }
    }
  }, [activeTab, activePano, pannellumReady]);

  // Lightbox handlers
  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxActive(true);
  };

  const closeLightbox = () => {
    setLightboxActive(false);
  };

  const handleNext = () => {
    if (filteredTraditional.length === 0) return;
    setCurrentImageIndex(prev => (prev + 1) % filteredTraditional.length);
  };

  const handlePrev = () => {
    if (filteredTraditional.length === 0) return;
    setCurrentImageIndex(prev => (prev - 1 + filteredTraditional.length) % filteredTraditional.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxActive) return;
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxActive, currentImageIndex, filteredTraditional.length]);

  // Swipe detection
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh', color: 'var(--color-gold)' }}>
        <div className="spinner-border spinner-luxury" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 fade-in-up">
      <SEO 
        title="Photos & Gallery | Pitam Deurali Guest House Pothana"
        description="Browse beautiful photos of Pitam Deurali Guest House, Mardi Himal Trek, Dhampus Village, and stunning Annapurna mountain views from our lodge in Nepal."
        keywords={[
          "Pothana Gallery", "Mardi Himal Photos", "Dhampus Village Gallery", "Pitam Deurali Guest House Photos", 
          "Himalayan View Gallery", "Annapurna Trek Lodge Pictures", "Deurali Guest House Gallery", 
          "Hotel in Pothana Photos", "Hotel in Dhampus Pictures", "Stay in Pothana Gallery", 
          "Australian Camp Photos", "Trekking Lodge Nepal Gallery", "Best Guest House in Dhampus Photos", 
          "Pokhara Trekking Stay Gallery", "Kaski Nepal Scenery", "Gandaki Province Trek Photos", 
          "Nepal Mountain Lodge Pictures", "Annapurna Sunrise Photos"
        ]}
        slug="/gallery"
      />
      {/* Page Header */}
      <div className="row justify-content-center text-center mb-4">
        <div className="col-lg-8 col-11">
          <h6 className="text-uppercase fw-semibold" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em', fontSize: '0.75rem' }}>
            Showcase
          </h6>
          <h1 className="display-4 font-serif fw-bold my-2 text-white">
            Guest House Gallery
          </h1>
          <div className="gold-accent-line"></div>
          <p className="lead text-secondary" style={{ fontSize: '1rem' }}>
            Explore our cozy guest house, organic dining, scenic surroundings, or take an interactive 360° virtual tour.
          </p>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="d-flex justify-content-center gap-3 mb-5">
        <button 
          onClick={() => setActiveTab('photos')}
          className={`btn px-4 py-2 border-0 rounded-0 text-uppercase small fw-bold ${activeTab === 'photos' ? 'btn-blue' : 'btn-blue-outline'}`}
          style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}
        >
          Photos
        </button>
        <button 
          onClick={() => {
            setActiveTab('360');
            if (panoramas.length > 0 && !activePano) {
              setActivePano(panoramas[0]);
            }
          }}
          className={`btn px-4 py-2 border-0 rounded-0 text-uppercase small fw-bold ${activeTab === '360' ? 'btn-blue' : 'btn-blue-outline'}`}
          style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}
        >
          360° Virtual Tour
        </button>
      </div>

      {/* TABS CONTENT */}
      {activeTab === 'photos' ? (
        <div>
          {/* Subcategory Filter Tabs */}
          <div className="d-flex flex-wrap justify-content-center gap-1 mb-4">
            <button 
              onClick={() => setPhotoCategory('All')}
              className={`btn btn-sm px-3 py-1.5 border-0 rounded-0 text-uppercase small ${photoCategory === 'All' ? 'btn-luxury' : 'btn-luxury-outline'}`}
              style={{ fontSize: '0.7rem' }}
            >
              All Photos
            </button>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setPhotoCategory(cat)}
                className={`btn btn-sm px-3 py-1.5 border-0 rounded-0 text-uppercase small ${photoCategory === cat ? 'btn-luxury' : 'btn-luxury-outline'}`}
                style={{ fontSize: '0.7rem' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Photos Grid */}
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {filteredTraditional.map((img, idx) => (
              <div 
                className="col" 
                key={img._id || idx} 
                onClick={() => openLightbox(idx)}
                style={{ cursor: 'pointer' }}
              >
                <div className="gallery-card">
                  <img 
                    src={getAPIImageUrl(img.url)} 
                    alt={img.caption || 'Gallery image'} 
                    loading="lazy"
                  />
                  {img.caption && (
                    <div className="gallery-card-info">
                      <span className="small text-uppercase tracking-wider" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{img.category}</span>
                      <p className="mb-0 font-serif" style={{ fontSize: '0.85rem', color: '#ffffff' }}>{img.caption}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredTraditional.length === 0 && (
              <div className="col-12 text-center my-5">
                <h5 className="font-serif text-secondary py-5">No images added in this category yet.</h5>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* 360° Virtual Tour Content */
        <div className="row g-4">
          <div className="col-lg-9 col-12">
            <div 
              id="panorama-viewer"
              style={{ 
                width: '100%', 
                height: '500px', 
                backgroundColor: '#000', 
                borderRadius: '4px', 
                border: '1px solid var(--border-color)', 
                position: 'relative' 
              }}
            >
              {!activePano && (
                <div className="h-100 d-flex justify-content-center align-items-center text-secondary font-serif">
                  No 360° panoramas available.
                </div>
              )}
            </div>
            {activePano && (
              <div className="mt-3 p-3" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                <h4 className="font-serif fw-bold text-white mb-1">{activePano.caption || 'Interactive Panorama'}</h4>
                <span className="small text-gold uppercase tracking-wider">360° Virtual Tour</span>
              </div>
            )}
          </div>

          <div className="col-lg-3 col-12">
            <div className="p-3 h-100" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
              <h5 className="font-serif fw-bold text-white mb-3">Tour Destinations</h5>
              <div className="d-flex flex-column gap-3">
                {panoramas.map((pano, idx) => (
                  <div 
                    key={pano._id || idx}
                    onClick={() => setActivePano(pano)}
                    style={{ cursor: 'pointer' }}
                    className={`d-flex align-items-center gap-2 p-2 border rounded transition-smooth ${activePano?._id === pano._id ? 'border-primary bg-secondary' : 'border-secondary'}`}
                  >
                    <div style={{ width: '60px', height: '60px', overflow: 'hidden', flexShrink: 0, borderRadius: '2px' }}>
                      <img src={getAPIImageUrl(pano.url)} alt="" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                    </div>
                    <div className="text-truncate">
                      <h6 className="font-sans mb-1 text-white small fw-bold text-truncate">{pano.caption || `Panorama ${idx + 1}`}</h6>
                      <span className="small text-muted" style={{ fontSize: '0.65rem' }}>Select to tour</span>
                    </div>
                  </div>
                ))}
                {panoramas.length === 0 && (
                  <p className="small text-secondary text-center py-4">No virtual tours added yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Preview */}
      {lightboxActive && filteredTraditional.length > 0 && (
        <div 
          className="lightbox-overlay"
          onClick={closeLightbox}
        >
          <div 
            className="lightbox-content-wrapper"
            onClick={e => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Close Button */}
            <button 
              type="button" 
              className="lightbox-close-btn"
              onClick={closeLightbox}
              aria-label="Close Lightbox"
            >
              <i className="bi bi-x"></i>
            </button>

            {/* Image Container */}
            <div className="lightbox-img-container">
              <img 
                src={getAPIImageUrl(filteredTraditional[currentImageIndex].url)} 
                alt={filteredTraditional[currentImageIndex].caption || 'Lightbox preview'} 
              />

              {/* Navigation Left */}
              {filteredTraditional.length > 1 && (
                <button 
                  className="lightbox-nav-btn lightbox-nav-prev"
                  onClick={handlePrev}
                  aria-label="Previous Image"
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
              )}

              {/* Navigation Right */}
              {filteredTraditional.length > 1 && (
                <button 
                  className="lightbox-nav-btn lightbox-nav-next"
                  onClick={handleNext}
                  aria-label="Next Image"
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              )}
            </div>

            {/* Caption & Counter Display Panel */}
            <div className="lightbox-info-panel">
              <div className="lightbox-counter">
                Image {currentImageIndex + 1} of {filteredTraditional.length}
              </div>
              <h5 className="font-serif text-white mb-1">
                {filteredTraditional[currentImageIndex].caption || 'New Pittam Deurali Guest House'}
              </h5>
              <span className="small text-muted text-uppercase tracking-wider">
                {filteredTraditional[currentImageIndex].category}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;

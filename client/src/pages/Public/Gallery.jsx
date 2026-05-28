import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState(null);

  const categories = ['All', 'Rooms', 'Exterior', 'Restaurant', 'Lobby', 'Pokhara Views', 'Events'];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get('/gallery');
        if (res.success) {
          setImages(res.data);
        }
      } catch (err) {
        console.error('Error loading gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const getAPIImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url}`;
  };

  const filteredImages = activeCategory === 'All' 
    ? images 
    : images.filter(img => img.category === activeCategory);

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
      <div className="row justify-content-center text-center mb-5">
        <div className="col-lg-8 col-11">
          <h6 className="text-uppercase fw-semibold" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em', fontSize: '0.75rem' }}>
            Gallery
          </h6>
          <h1 className="display-4 font-serif fw-bold my-2 text-white">Visual Sanctuary</h1>
          <div className="gold-accent-line"></div>
          <p className="lead text-secondary" style={{ fontSize: '1rem' }}>
            Glimpses into our quiet halls, gardens, design details, and the reflection of the mountains.
          </p>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="d-flex flex-wrap justify-content-center gap-1 mb-5">
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            className={`btn btn-sm px-4 py-2 border-0 rounded-0 text-uppercase small ${activeCategory === cat ? 'btn-luxury' : 'btn-luxury-outline'}`}
            style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry / Responsive Grid */}
      <div className="row g-4 gallery-grid">
        {filteredImages.map(img => (
          <div className="col-lg-4 col-md-6" key={img._id} onClick={() => setLightboxImage(img)}>
            <div className="gallery-card">
              <img 
                src={getAPIImageUrl(img.url)} 
                alt={img.caption || 'Gallery Image'} 
                loading="lazy"
              />
              <div className="gallery-card-info">
                <span className="small text-uppercase tracking-wider" style={{ color: 'var(--color-gold)', fontSize: '0.7rem' }}>
                  {img.category}
                </span>
                <p className="mb-0 font-serif fs-6 text-white mt-1">{img.caption || 'Sanctum Retreat'}</p>
              </div>
            </div>
          </div>
        ))}

        {filteredImages.length === 0 && (
          <div className="col-12 text-center my-5">
            <h5 className="font-serif text-secondary">No images in this category yet.</h5>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="modal fade show d-block" 
          tabIndex="-1" 
          role="dialog" 
          style={{ backgroundColor: 'rgba(18, 18, 19, 0.95)', zIndex: 1060 }}
          onClick={() => setLightboxImage(null)}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-content rounded-0 bg-transparent border-0 position-relative">
              <button 
                type="button" 
                className="btn-close btn-close-white position-absolute top-0 end-0 m-3" 
                aria-label="Close"
                onClick={() => setLightboxImage(null)}
              ></button>
              
              <div className="modal-body p-0 text-center">
                <img 
                  src={getAPIImageUrl(lightboxImage.url)} 
                  alt={lightboxImage.caption} 
                  className="img-fluid" 
                  style={{ maxHeight: '80vh', objectFit: 'contain' }}
                />
                {lightboxImage.caption && (
                  <div className="p-3 text-white">
                    <p className="font-serif fs-5 mb-1">{lightboxImage.caption}</p>
                    <span className="small text-muted text-uppercase">{lightboxImage.category}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;

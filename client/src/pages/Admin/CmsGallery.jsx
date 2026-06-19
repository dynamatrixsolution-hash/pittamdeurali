import React, { useState, useEffect } from 'react';
import api, { getAPIImageUrl } from '../../services/api';

const CmsGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Form Fields
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('Rooms');
  const [caption, setCaption] = useState('');

  const categories = ['Guest House', 'Rooms', 'Restaurant', 'Surroundings', 'Facilities'];

  const fetchGallery = async () => {
    try {
      const res = await api.get('/gallery');
      if (res.success) {
        setImages(res.data);
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // --- Strict Validation ---
  const isCaptionValid = caption.length === 0 || (caption.length >= 2 && caption.length <= 100);
  const isFormValid = file !== null && isCaptionValid;

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setMsg({ type: 'danger', text: 'Validation Error: Caption must be 2-100 characters.' });
      return;
    }

    setMsg({ type: '', text: '' });
    setUploading(true);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', category);
    formData.append('caption', caption);

    try {
      const res = await api.post('/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.success) {
        setMsg({ type: 'success', text: 'Image added to gallery!' });
        setFile(null);
        setCaption('');
        document.getElementById('galleryFile').value = '';
        fetchGallery();
      }
    } catch (err) {
      setMsg({ type: 'danger', text: typeof err === 'string' ? err : 'Upload failed.' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    setMsg({ type: '', text: '' });

    try {
      const res = await api.delete(`/gallery/${id}`);
      if (res.success) {
        setMsg({ type: 'success', text: 'Image deleted from gallery.' });
        fetchGallery();
      }
    } catch (err) {
      setMsg({ type: 'danger', text: typeof err === 'string' ? err : 'Delete failed.' });
    }
  };

  const filteredImages = activeCategory === 'All' 
    ? images 
    : images.filter(img => img.category === activeCategory);


  if (loading) {
    return <div className="text-center p-5 text-secondary"><div className="spinner-border spinner-luxury" /></div>;
  }

  return (
    <div className="fade-in-up">
      <h3 className="font-serif fw-bold mb-4 text-white">Gallery CMS Manager</h3>

      {msg.text && <div className={`alert alert-${msg.type} rounded-0 py-2 mb-4`}>{msg.text}</div>}

      <div className="row g-4">
        {/* Upload Form Block */}
        <div className="col-lg-4">
          <form onSubmit={handleUploadSubmit} className="p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
            <h5 className="font-serif fw-bold text-white mb-3" style={{ color: 'var(--color-gold) !important' }}>Upload Asset</h5>
            
            <div className="mb-3">
              <label className="form-label-luxury">Select Image *</label>
              <input type="file" id="galleryFile" className="form-control form-luxury" onChange={handleFileChange} accept="image/*" required />
              {file && (
                <div className="mt-2" style={{ maxWidth: '100%', maxHeight: '180px', overflow: 'hidden', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                  <img src={URL.createObjectURL(file)} alt="Upload Preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label-luxury">Category *</label>
              <select className="form-select form-luxury" value={category} onChange={e => setCategory(e.target.value)} required>
                {categories.map(cat => <option value={cat} key={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label-luxury">Caption / Hover Text</label>
              <input type="text" className="form-control form-luxury" value={caption} onChange={e => setCaption(e.target.value)} placeholder="e.g. Sunrise view" />
              <div className={`char-counter ${!isCaptionValid ? 'error' : ''}`}>
                {caption.length} / 100 characters (min 2)
              </div>
            </div>

            <button type="submit" className="btn btn-luxury w-100 py-3" disabled={uploading || !isFormValid}>
              {uploading ? 'Uploading Asset...' : 'Upload Image'}
            </button>
          </form>
        </div>

        {/* Gallery Grid Block */}
        <div className="col-lg-8">
          <div className="p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
              <h5 className="font-serif fw-bold text-white m-0">Asset Library</h5>
              <div className="d-flex gap-1">
                <button className={`btn btn-sm py-1 px-2 border-0 rounded-0 text-uppercase ${activeCategory === 'All' ? 'btn-luxury' : 'btn-luxury-outline'}`} style={{ fontSize: '0.65rem' }} onClick={() => setActiveCategory('All')}>All</button>
                {categories.map(cat => (
                  <button key={cat} className={`btn btn-sm py-1 px-2 border-0 rounded-0 text-uppercase ${activeCategory === cat ? 'btn-luxury' : 'btn-luxury-outline'}`} style={{ fontSize: '0.65rem' }} onClick={() => setActiveCategory(cat)}>{cat}</button>
                ))}
              </div>
            </div>

            <div className="row g-3">
              {filteredImages.map(img => (
                <div className="col-md-4 col-sm-6" key={img._id}>
                  <div className="position-relative" style={{ height: '140px', border: '1px solid var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                    <img src={getAPIImageUrl(img.url)} alt="" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                    <div className="position-absolute bottom-0 start-0 end-0 p-1 bg-dark bg-opacity-70 text-white text-truncate small" style={{ fontSize: '0.7rem' }}>
                      {img.caption || 'No Caption'}
                    </div>
                    <button type="button" className="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-0 py-0 px-2" style={{ fontSize: '0.8rem' }} onClick={() => handleDelete(img._id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
              {filteredImages.length === 0 && (
                <div className="col-12 text-center py-5 text-secondary">
                  No assets found in this category.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CmsGallery;

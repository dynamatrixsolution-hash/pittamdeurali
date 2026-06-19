import React, { useState, useEffect } from 'react';
import api, { getAPIImageUrl } from '../../services/api';

const CmsRestaurantInfo = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState('');
  
  // Cover Image
  const [coverImage, setCoverImage] = useState('');
  const [coverFile, setCoverFile] = useState(null);

  // Gallery
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryFiles, setGalleryFiles] = useState([]);

  const fetchRestaurantData = async () => {
    try {
      const res = await api.get('/restaurant');
      if (res.success && res.data) {
        setTitle(res.data.title || '');
        setSubtitle(res.data.subtitle || '');
        setDescription(res.data.description || '');
        setFeatures(res.data.features || []);
        setCoverImage(res.data.coverImage || '');
        setGalleryImages(res.data.galleryImages || []);
      }
    } catch (err) {
      console.error('Error fetching restaurant details:', err);
      setMsg({ type: 'danger', text: 'Failed to load restaurant details.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  const handleAddFeature = (e) => {
    e.preventDefault();
    if (!newFeature.trim()) return;
    if (features.includes(newFeature.trim())) {
      setMsg({ type: 'warning', text: 'Feature already exists.' });
      return;
    }
    setFeatures([...features, newFeature.trim()]);
    setNewFeature('');
  };

  const handleRemoveFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // Submit text & cover updates
  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setMsg({ type: 'danger', text: 'Title and Description are required.' });
      return;
    }

    setSaving(true);
    setMsg({ type: '', text: '' });

    const formData = new FormData();
    formData.append('title', title);
    formData.append('subtitle', subtitle);
    formData.append('description', description);
    formData.append('features', JSON.stringify(features));

    if (coverFile) {
      formData.append('coverImage', coverFile);
    }

    try {
      const res = await api.put('/restaurant', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.success) {
        setMsg({ type: 'success', text: 'Restaurant general details saved successfully!' });
        setCoverFile(null);
        if (res.data) {
          setCoverImage(res.data.coverImage || '');
        }
      }
    } catch (err) {
      setMsg({ type: 'danger', text: typeof err === 'string' ? err : 'Error saving details.' });
    } finally {
      setSaving(false);
    }
  };

  // Upload new gallery files
  const handleUploadGallery = async (e) => {
    e.preventDefault();
    if (galleryFiles.length === 0) return;

    setUploadingGallery(true);
    setMsg({ type: '', text: '' });

    const formData = new FormData();
    for (let i = 0; i < galleryFiles.length; i++) {
      formData.append('gallery', galleryFiles[i]);
    }

    try {
      const res = await api.post('/restaurant/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.success) {
        setMsg({ type: 'success', text: 'Gallery images uploaded and added successfully!' });
        setGalleryFiles([]);
        if (res.data) {
          setGalleryImages(res.data.galleryImages || []);
        }
      }
    } catch (err) {
      setMsg({ type: 'danger', text: typeof err === 'string' ? err : 'Upload failed.' });
    } finally {
      setUploadingGallery(false);
    }
  };

  // Delete a specific gallery image
  const handleDeleteGalleryItem = async (url) => {
    if (!window.confirm('Are you sure you want to delete this gallery photo?')) return;
    setMsg({ type: '', text: '' });

    try {
      const res = await api.delete('/restaurant/gallery', {
        data: { imageUrl: url }
      });
      if (res.success) {
        setMsg({ type: 'success', text: 'Gallery photo deleted successfully.' });
        if (res.data) {
          setGalleryImages(res.data.galleryImages || []);
        }
      }
    } catch (err) {
      setMsg({ type: 'danger', text: typeof err === 'string' ? err : 'Delete failed.' });
    }
  };


  if (loading) {
    return <div className="text-center p-5 text-secondary"><div className="spinner-border spinner-luxury" /></div>;
  }

  return (
    <div className="fade-in-up text-white">
      <div className="mb-4">
        <h3 className="font-serif fw-bold m-0">Restaurant Management CMS</h3>
        <p className="text-secondary small m-0">Configure title banners, kitchen philosophies, local features, cover images, and restaurant gallery collages.</p>
      </div>

      {msg.text && <div className={`alert alert-${msg.type} rounded-0 py-2 mb-4`}>{msg.text}</div>}

      <div className="row g-4">
        {/* Main details form */}
        <div className="col-lg-7 col-12">
          <form onSubmit={handleUpdateInfo} className="p-4 d-flex flex-column gap-3" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
            <h5 className="font-serif fw-bold text-white mb-2 border-bottom pb-2" style={{ borderColor: 'var(--border-color)', color: 'var(--color-gold) !important' }}>
              Restaurant Details & Cover
            </h5>

            <div className="row g-3">
              <div className="col-12">
                <label className="form-label-luxury">Restaurant Section Title *</label>
                <input 
                  type="text" 
                  className="form-control form-luxury" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  required 
                />
              </div>

              <div className="col-12">
                <label className="form-label-luxury">Section Subtitle</label>
                <input 
                  type="text" 
                  className="form-control form-luxury" 
                  value={subtitle} 
                  onChange={e => setSubtitle(e.target.value)} 
                />
              </div>

              <div className="col-12">
                <label className="form-label-luxury">Section Description *</label>
                <textarea 
                  className="form-control form-luxury" 
                  rows="4" 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  required
                ></textarea>
              </div>

              <div className="col-12">
                <label className="form-label-luxury">Upload Restaurant Cover Image</label>
                <input 
                  type="file" 
                  className="form-control form-luxury mb-2" 
                  accept="image/*"
                  onChange={e => setCoverFile(e.target.files[0])} 
                />
                
                {coverFile && (
                  <div className="mb-2" style={{ maxWidth: '240px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <span className="small text-muted d-block mb-1">New Cover Preview:</span>
                    <img src={URL.createObjectURL(coverFile)} alt="Cover Preview" style={{ width: '100%', height: 'auto' }} />
                  </div>
                )}

                {coverImage && !coverFile && (
                  <div>
                    <span className="small text-muted d-block mb-1">Current Cover Image:</span>
                    <img 
                      src={getAPIImageUrl(coverImage)} 
                      alt="Cover" 
                      style={{ width: '240px', height: '140px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                    />
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="btn btn-luxury px-5 py-3 mt-3 align-self-start" disabled={saving}>
              {saving ? 'Saving Details...' : 'Save Restaurant Details'}
            </button>
          </form>
        </div>

        {/* Feature list & Gallery management */}
        <div className="col-lg-5 col-12 d-flex flex-column gap-4">
          
          {/* Feature List Manager */}
          <div className="p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
            <h5 className="font-serif fw-bold text-white mb-3 border-bottom pb-2" style={{ borderColor: 'var(--border-color)', color: 'var(--color-gold) !important' }}>
              Kitchen Features Checklist
            </h5>

            <ul className="list-unstyled d-flex flex-column gap-2 mb-3">
              {features.map((feat, idx) => (
                <li key={idx} className="d-flex justify-content-between align-items-center p-2 border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
                  <span className="small"><i className="bi bi-patch-check-fill text-success me-2"></i> {feat}</span>
                  <button type="button" className="btn btn-sm btn-outline-danger border-0 p-1" onClick={() => handleRemoveFeature(idx)}>
                    <i className="bi bi-trash small"></i>
                  </button>
                </li>
              ))}
              {features.length === 0 && (
                <li className="text-secondary small italic text-center py-2">No features listed yet.</li>
              )}
            </ul>

            <form onSubmit={handleAddFeature} className="d-flex gap-2">
              <input 
                type="text" 
                className="form-control form-luxury py-2" 
                placeholder="e.g. 100% Organic Produce"
                value={newFeature} 
                onChange={e => setNewFeature(e.target.value)} 
              />
              <button type="submit" className="btn btn-luxury-outline px-3">
                Add
              </button>
            </form>
          </div>

          {/* Gallery Image Manager */}
          <div className="p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
            <h5 className="font-serif fw-bold text-white mb-3 border-bottom pb-2" style={{ borderColor: 'var(--border-color)', color: 'var(--color-gold) !important' }}>
              Restaurant Photo Gallery
            </h5>

            {/* Gallery Upload form */}
            <form onSubmit={handleUploadGallery} className="mb-4">
              <label className="form-label-luxury">Upload New Gallery Photos</label>
              <div className="d-flex gap-2 align-items-center">
                <input 
                  type="file" 
                  multiple 
                  className="form-control form-luxury py-2" 
                  accept="image/*"
                  onChange={e => setGalleryFiles(Array.from(e.target.files))} 
                />
                <button type="submit" className="btn btn-luxury text-nowrap py-2.5 px-3" disabled={uploadingGallery || galleryFiles.length === 0}>
                  {uploadingGallery ? 'Uploading...' : 'Upload'}
                </button>
              </div>
              {galleryFiles.length > 0 && (
                <div className="small text-gold mt-1">Ready to upload {galleryFiles.length} file(s)</div>
              )}
            </form>

            {/* Gallery Grid */}
            <div className="row g-2">
              {galleryImages.map((imgUrl, idx) => (
                <div className="col-4 position-relative gallery-item-container" key={idx}>
                  <img 
                    src={getAPIImageUrl(imgUrl)} 
                    alt="Gallery item" 
                    className="w-100" 
                    style={{ height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }} 
                  />
                  <button 
                    type="button" 
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 p-0 m-1 d-flex align-items-center justify-content-center"
                    style={{ width: '22px', height: '22px', borderRadius: '50%', border: 'none', opacity: 0.85 }}
                    onClick={() => handleDeleteGalleryItem(imgUrl)}
                    title="Delete Photo"
                  >
                    <i className="bi bi-x fs-6"></i>
                  </button>
                </div>
              ))}
              {galleryImages.length === 0 && (
                <div className="col-12 text-center text-secondary small italic py-3">No gallery images uploaded yet.</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CmsRestaurantInfo;

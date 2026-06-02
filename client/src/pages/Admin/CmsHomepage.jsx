import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const CmsHomepage = () => {
  const [homepage, setHomepage] = useState({
    welcome: { title: '', subtitle: '', description: '', image: '' },
    roomsSection: { title: '', subtitle: '' },
    servicesSection: { title: '', subtitle: '' },
    testimonialsSection: { title: '', subtitle: '' },
    gallerySection: { title: '', subtitle: '' },
    faqs: []
  });

  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });

  // Hero Form State
  const [heroFormView, setHeroFormView] = useState('list'); // 'list', 'add', 'edit'
  const [selectedHeroId, setSelectedHeroId] = useState(null);
  const [heroForm, setHeroForm] = useState({
    title: '',
    subtitle: '',
    buttonText: 'Explore Rooms',
    buttonLink: '/rooms',
    order: 0,
    active: true
  });
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [existingHeroImageUrl, setExistingHeroImageUrl] = useState('');

  const getAPIImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
    return `${baseUrl}${url}`;
  };

  const fetchHeroes = async () => {
    try {
      const res = await api.get('/heroes');
      if (res.success) {
        setHeroes(res.data);
      }
    } catch (err) {
      console.error('Error fetching heroes list:', err);
    }
  };

  useEffect(() => {
    const fetchHomepage = async () => {
      try {
        const [cmsRes] = await Promise.all([
          api.get('/cms/homepage'),
          fetchHeroes()
        ]);
        if (cmsRes.success && cmsRes.data) {
          setHomepage(cmsRes.data);
        }
      } catch (err) {
        console.error('Error fetching homepage CMS details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomepage();
  }, []);

  const handleFileUpload = async (e, target) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setMsg({ type: 'info', text: 'Uploading image...' });
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.success && res.url) {
        setMsg({ type: 'success', text: 'Image uploaded successfully!' });
        if (target === 'welcome') {
          setHomepage(prev => ({
            ...prev,
            welcome: { ...prev.welcome, image: res.url }
          }));
        }
      } else {
        setMsg({ type: 'danger', text: 'Upload failed: ' + (res.message || 'Unknown error') });
      }
    } catch (err) {
      console.error('File upload error:', err);
      setMsg({ type: 'danger', text: 'Upload failed: ' + (typeof err === 'string' ? err : 'Server error') });
    }
  };

  // Hero Handlers
  const handleHeroFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHeroForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleHeroSubmit = async (e) => {
    e.preventDefault();
    if (!heroForm.title.trim() || !heroForm.subtitle.trim()) {
      alert('Title and Subtitle are required.');
      return;
    }

    setSaving(true);
    setMsg({ type: '', text: '' });

    const formData = new FormData();
    formData.append('title', heroForm.title);
    formData.append('subtitle', heroForm.subtitle);
    formData.append('buttonText', heroForm.buttonText);
    formData.append('buttonLink', heroForm.buttonLink);
    formData.append('order', heroForm.order);
    formData.append('active', heroForm.active);

    if (heroImageFile) {
      formData.append('image', heroImageFile);
    }

    try {
      let res;
      if (heroFormView === 'add') {
        if (!heroImageFile) {
          alert('Please select a background image.');
          setSaving(false);
          return;
        }
        res = await api.post('/heroes', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await api.put(`/heroes/${selectedHeroId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (res.success) {
        setMsg({ type: 'success', text: `Hero slide ${heroFormView === 'add' ? 'created' : 'updated'} permanently!` });
        resetHeroForm();
        setHeroFormView('list');
        fetchHeroes();
      }
    } catch (err) {
      setMsg({ type: 'danger', text: typeof err === 'string' ? err : 'Failed to save hero slide.' });
    } finally {
      setSaving(false);
    }
  };

  const handleHeroDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hero slide permanently?')) return;
    setMsg({ type: '', text: '' });
    try {
      const res = await api.delete(`/heroes/${id}`);
      if (res.success) {
        setMsg({ type: 'success', text: 'Hero slide deleted permanently!' });
        fetchHeroes();
      }
    } catch (err) {
      setMsg({ type: 'danger', text: typeof err === 'string' ? err : 'Failed to delete.' });
    }
  };

  const startEditHero = (hero) => {
    setSelectedHeroId(hero._id);
    setHeroForm({
      title: hero.title,
      subtitle: hero.subtitle,
      buttonText: hero.buttonText || 'Explore Rooms',
      buttonLink: hero.buttonLink || '/rooms',
      order: hero.order || 0,
      active: hero.active ?? true
    });
    setExistingHeroImageUrl(hero.imageUrl);
    setHeroImageFile(null);
    setHeroFormView('edit');
  };

  const resetHeroForm = () => {
    setHeroForm({
      title: '',
      subtitle: '',
      buttonText: 'Explore Rooms',
      buttonLink: '/rooms',
      order: 0,
      active: true
    });
    setHeroImageFile(null);
    setExistingHeroImageUrl('');
    setSelectedHeroId(null);
  };

  // General Form Handlers
  const handleWelcomeChange = (e) => {
    setHomepage({
      ...homepage,
      welcome: { ...homepage.welcome, [e.target.name]: e.target.value }
    });
  };

  const handleSectionChange = (section, e) => {
    setHomepage({
      ...homepage,
      [section]: { ...homepage[section], [e.target.name]: e.target.value }
    });
  };

  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...homepage.faqs];
    updatedFaqs[index][field] = value;
    setHomepage({ ...homepage, faqs: updatedFaqs });
  };

  const addFaq = () => {
    if (!newFaq.question || !newFaq.answer) return;
    setHomepage({
      ...homepage,
      faqs: [...homepage.faqs, { ...newFaq }]
    });
    setNewFaq({ question: '', answer: '' });
  };

  const removeFaq = (index) => {
    const updatedFaqs = homepage.faqs.filter((_, idx) => idx !== index);
    setHomepage({ ...homepage, faqs: updatedFaqs });
  };

  // Validation Checkers
  const isWelcomeTitleValid = homepage.welcome?.title?.trim().length > 0;
  const isWelcomeDescValid = homepage.welcome?.description?.trim().length > 0;
  const isFormValid = isWelcomeTitleValid && isWelcomeDescValid;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setMsg({ type: 'danger', text: 'Validation Error: Welcome Title and Description are required.' });
      return;
    }

    setSaving(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await api.put('/cms/homepage', homepage);
      if (res.success) {
        setMsg({ type: 'success', text: 'Homepage CMS options saved permanently!' });
      }
    } catch (err) {
      setMsg({ type: 'danger', text: typeof err === 'string' ? err : 'Update failed.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center p-5 text-secondary"><div className="spinner-border spinner-luxury" /></div>;
  }

  return (
    <div className="fade-in-up">
      <h3 className="font-serif fw-bold mb-4 text-white">Hero & Homepage Management</h3>

      {msg.text && <div className={`alert alert-${msg.type} rounded-0 py-2 mb-4`}>{msg.text}</div>}

      {/* 1. HERO SLIDER DEDICATED MANAGEMENT */}
      <div className="p-4 mb-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="font-serif fw-bold text-white m-0" style={{ color: 'var(--color-gold) !important' }}>1. Hero Banner Slideshow</h5>
          {heroFormView === 'list' ? (
            <button type="button" className="btn btn-sm btn-luxury py-1.5 px-3" onClick={() => { resetHeroForm(); setHeroFormView('add'); }}>
              <i className="bi bi-plus-lg me-1"></i> Add New Slide
            </button>
          ) : (
            <button type="button" className="btn btn-sm btn-luxury-outline py-1.5 px-3" onClick={() => { resetHeroForm(); setHeroFormView('list'); }}>
              Back to List
            </button>
          )}
        </div>
        <p className="small text-secondary mb-4">Upload background images, set buttons, and control order. Slides are stored permanently in MongoDB.</p>

        {heroFormView === 'list' ? (
          <div className="table-responsive table-luxury">
            <table className="table table-dark mb-0 align-middle small">
              <thead>
                <tr className="text-uppercase" style={{ fontSize: '0.75rem', color: 'var(--color-gold)' }}>
                  <th className="py-3 px-3">Preview</th>
                  <th className="py-3">Slide Title</th>
                  <th className="py-3">Order</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 px-3 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {heroes.map(slide => (
                  <tr key={slide._id}>
                    <td className="py-2 px-3">
                      <div style={{ width: '80px', height: '45px', overflow: 'hidden', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                        <img src={getAPIImageUrl(slide.imageUrl)} alt="" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                      </div>
                    </td>
                    <td className="py-2 fw-bold text-white">{slide.title}</td>
                    <td className="py-2 text-secondary">{slide.order}</td>
                    <td className="py-2">
                      <span className={`badge rounded-0 ${slide.active ? 'bg-success' : 'bg-secondary'}`}>
                        {slide.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-end">
                      <button type="button" className="btn btn-sm btn-luxury-outline me-2 py-1 px-2 border-0" onClick={() => startEditHero(slide)}>
                        <i className="bi bi-pencil-square me-1"></i> Edit/Replace
                      </button>
                      <button type="button" className="btn btn-sm btn-outline-danger py-1 px-2 border-0" onClick={() => handleHeroDelete(slide._id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {heroes.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-secondary">No hero slides found. Add one to show on Homepage.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <form onSubmit={handleHeroSubmit} className="p-3 border d-flex flex-column gap-3" style={{ borderColor: 'var(--border-color)', borderRadius: '4px', backgroundColor: 'var(--bg-secondary)' }}>
            <h6 className="fw-bold mb-0 text-white">{heroFormView === 'add' ? 'Create Hero Slide' : 'Modify Hero Slide'}</h6>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label-luxury">Slide Title *</label>
                <input 
                  type="text" 
                  name="title" 
                  className="form-control form-luxury" 
                  value={heroForm.title} 
                  onChange={handleHeroFormChange} 
                  required 
                />
              </div>

              <div className="col-md-6">
                <label className="form-label-luxury">Background Image *</label>
                <input 
                  type="file" 
                  className="form-control form-luxury" 
                  onChange={e => setHeroImageFile(e.target.files[0])} 
                  accept="image/*" 
                  required={heroFormView === 'add'} 
                />
                {heroImageFile && (
                  <div className="mt-2" style={{ maxWidth: '160px', height: '90px', overflow: 'hidden', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                    <img src={URL.createObjectURL(heroImageFile)} alt="Upload Preview" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                  </div>
                )}
                {heroFormView === 'edit' && existingHeroImageUrl && !heroImageFile && (
                  <div className="mt-2">
                    <span className="small text-secondary d-block mb-1">Current Image:</span>
                    <div style={{ maxWidth: '160px', height: '90px', overflow: 'hidden', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                      <img src={getAPIImageUrl(existingHeroImageUrl)} alt="Current representation" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                    </div>
                  </div>
                )}
              </div>

              <div className="col-md-12">
                <label className="form-label-luxury">Slide Subtitle *</label>
                <textarea 
                  name="subtitle" 
                  className="form-control form-luxury" 
                  rows="2" 
                  value={heroForm.subtitle} 
                  onChange={handleHeroFormChange} 
                  required 
                />
              </div>

              <div className="col-md-4">
                <label className="form-label-luxury">Button CTA Label</label>
                <input 
                  type="text" 
                  name="buttonText" 
                  className="form-control form-luxury" 
                  value={heroForm.buttonText} 
                  onChange={handleHeroFormChange} 
                />
              </div>

              <div className="col-md-4">
                <label className="form-label-luxury">Button CTA Link</label>
                <input 
                  type="text" 
                  name="buttonLink" 
                  className="form-control form-luxury" 
                  value={heroForm.buttonLink} 
                  onChange={handleHeroFormChange} 
                />
              </div>

              <div className="col-md-2">
                <label className="form-label-luxury">Slide Order</label>
                <input 
                  type="number" 
                  name="order" 
                  className="form-control form-luxury" 
                  value={heroForm.order} 
                  onChange={handleHeroFormChange} 
                />
              </div>

              <div className="col-md-2 d-flex align-items-center">
                <div className="form-check form-switch mt-3">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    name="active" 
                    id="heroFormActive"
                    checked={heroForm.active}
                    onChange={handleHeroFormChange}
                  />
                  <label className="form-check-label text-white ms-2" htmlFor="heroFormActive">Active</label>
                </div>
              </div>
            </div>

            <div className="d-flex gap-2 mt-2">
              <button type="submit" className="btn btn-sm btn-luxury py-2 px-4" disabled={saving}>
                {saving ? 'Saving...' : 'Save Permanently'}
              </button>
              <button type="button" className="btn btn-sm btn-luxury-outline py-2 px-4" onClick={() => setHeroFormView('list')}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <form onSubmit={handleSave} className="d-flex flex-column gap-4">
        {/* 2. WELCOME SECTION CMS */}
        <div className="p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
          <h5 className="font-serif fw-bold text-white mb-3" style={{ color: 'var(--color-gold) !important' }}>2. Welcome Introduction</h5>
          
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label-luxury">Section Title *</label>
              <input 
                type="text" 
                name="title" 
                className="form-control form-luxury"
                value={homepage.welcome.title}
                onChange={handleWelcomeChange}
                required
              />
              <div className={`char-counter ${!isWelcomeTitleValid ? 'error' : ''}`}>
                {homepage.welcome.title.length} / 100 characters (min 5)
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label-luxury">Section Subtitle *</label>
              <input 
                type="text" 
                name="subtitle" 
                className="form-control form-luxury"
                value={homepage.welcome.subtitle}
                onChange={handleWelcomeChange}
                required
              />
            </div>
            <div className="col-md-12">
              <label className="form-label-luxury">Section Image *</label>
              <div className="input-group">
                <input 
                  type="text" 
                  name="image" 
                  className="form-control form-luxury"
                  value={homepage.welcome.image}
                  onChange={handleWelcomeChange}
                  required
                />
                <label className="input-group-text bg-secondary border-secondary text-white" style={{ cursor: 'pointer', fontSize: '0.8rem' }}>
                  <i className="bi bi-upload me-1"></i> Upload
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="d-none" 
                    onChange={(e) => handleFileUpload(e, 'welcome')} 
                  />
                </label>
              </div>
              {homepage.welcome.image && (
                <div className="mt-2" style={{ maxWidth: '300px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  <img src={getAPIImageUrl(homepage.welcome.image)} alt="Welcome Preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
              )}
            </div>
            <div className="col-12">
              <label className="form-label-luxury">Guest House Description *</label>
              <textarea 
                name="description" 
                className="form-control form-luxury"
                rows="4"
                value={homepage.welcome.description}
                onChange={handleWelcomeChange}
                required
              ></textarea>
              <div className={`char-counter ${!isWelcomeDescValid ? 'error' : ''}`}>
                {homepage.welcome.description.length} / 1200 characters (min 80)
              </div>
            </div>
          </div>
        </div>

        {/* 3. SECTION HEADINGS CMS */}
        <div className="p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
          <h5 className="font-serif fw-bold text-white mb-3" style={{ color: 'var(--color-gold) !important' }}>3. Section Headers</h5>
          
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label-luxury">Rooms Title *</label>
              <input type="text" name="title" className="form-control form-luxury" value={homepage.roomsSection.title} onChange={e => handleSectionChange('roomsSection', e)} required />
            </div>
            <div className="col-md-6">
              <label className="form-label-luxury">Rooms Subtitle *</label>
              <input type="text" name="subtitle" className="form-control form-luxury" value={homepage.roomsSection.subtitle} onChange={e => handleSectionChange('roomsSection', e)} required />
            </div>
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label-luxury">Services Title *</label>
              <input type="text" name="title" className="form-control form-luxury" value={homepage.servicesSection.title} onChange={e => handleSectionChange('servicesSection', e)} required />
            </div>
            <div className="col-md-6">
              <label className="form-label-luxury">Services Subtitle *</label>
              <input type="text" name="subtitle" className="form-control form-luxury" value={homepage.servicesSection.subtitle} onChange={e => handleSectionChange('servicesSection', e)} required />
            </div>
          </div>
        </div>

        {/* 4. FAQS CMS */}
        <div className="p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
          <h5 className="font-serif fw-bold text-white mb-3" style={{ color: 'var(--color-gold) !important' }}>4. FAQs Manager</h5>
          
          <div className="d-flex flex-column gap-3 mb-4">
            {homepage.faqs.map((faq, idx) => (
              <div key={idx} className="p-3 border d-flex flex-column gap-2" style={{ borderColor: 'var(--border-color)', borderRadius: '4px' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="small text-muted fw-bold">FAQ #{idx + 1}</span>
                  <button type="button" className="btn btn-sm btn-danger py-0 px-2 rounded-0 small" onClick={() => removeFaq(idx)}>
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </div>
                <input 
                  type="text" 
                  className="form-control form-luxury" 
                  placeholder="Question" 
                  value={faq.question}
                  onChange={e => handleFaqChange(idx, 'question', e.target.value)}
                  required
                />
                <textarea 
                  className="form-control form-luxury" 
                  placeholder="Answer text" 
                  rows="2" 
                  value={faq.answer}
                  onChange={e => handleFaqChange(idx, 'answer', e.target.value)}
                  required
                ></textarea>
              </div>
            ))}
          </div>

          <div className="p-3 border" style={{ borderColor: 'var(--border-color)', borderStyle: 'dashed', borderRadius: '4px' }}>
            <h6 className="fw-bold mb-2">Add New FAQ</h6>
            <input 
              type="text" 
              className="form-control form-luxury mb-2" 
              placeholder="Enter Question" 
              value={newFaq.question}
              onChange={e => setNewFaq({ ...newFaq, question: e.target.value })}
            />
            <textarea 
              className="form-control form-luxury mb-2" 
              placeholder="Enter Answer" 
              rows="2"
              value={newFaq.answer}
              onChange={e => setNewFaq({ ...newFaq, answer: e.target.value })}
            ></textarea>
            <button type="button" className="btn btn-sm btn-luxury py-1 px-3 mt-1" onClick={addFaq}>
              Add FAQ Card
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-luxury py-3 px-5 align-self-start animate-pulse" 
          disabled={saving || !isFormValid}
        >
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </form>
    </div>
  );
};

export default CmsHomepage;

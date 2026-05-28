import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const CmsHomepage = () => {
  const [homepage, setHomepage] = useState({
    hero: { title: '', subtitle: '', buttonText: '', buttonLink: '', image: '' },
    welcome: { title: '', subtitle: '', description: '', image: '' },
    roomsSection: { title: '', subtitle: '' },
    servicesSection: { title: '', subtitle: '' },
    experiencesSection: { title: '', subtitle: '' },
    testimonialsSection: { title: '', subtitle: '' },
    gallerySection: { title: '', subtitle: '' },
    faqs: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });

  useEffect(() => {
    const fetchHomepage = async () => {
      try {
        const res = await api.get('/cms/homepage');
        if (res.success && res.data) {
          setHomepage(res.data);
        }
      } catch (err) {
        console.error('Error fetching homepage CMS:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomepage();
  }, []);

  const handleHeroChange = (e) => {
    setHomepage({
      ...homepage,
      hero: { ...homepage.hero, [e.target.name]: e.target.value }
    });
  };

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

  // FAQ handlers
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

  // --- Strict Validation Checks ---
  const isHeroTitleValid = homepage.hero.title.length >= 10 && homepage.hero.title.length <= 80;
  const isHeroSubtitleValid = homepage.hero.subtitle.length >= 30 && homepage.hero.subtitle.length <= 250;
  
  // Welcome section validation
  const isWelcomeTitleValid = homepage.welcome.title.length >= 5 && homepage.welcome.title.length <= 100;
  const isWelcomeDescValid = homepage.welcome.description.length >= 80 && homepage.welcome.description.length <= 1200;

  const isFormValid = isHeroTitleValid && isHeroSubtitleValid && isWelcomeTitleValid && isWelcomeDescValid;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setMsg({ type: 'danger', text: 'Validation Error: Check character limits before saving.' });
      return;
    }

    setSaving(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await api.put('/cms/homepage', homepage);
      if (res.success) {
        setMsg({ type: 'success', text: 'Homepage CMS updated successfully!' });
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
      <h3 className="font-serif fw-bold mb-4 text-white">Homepage CMS</h3>

      {msg.text && <div className={`alert alert-${msg.type} rounded-0 py-2 mb-4`}>{msg.text}</div>}

      <form onSubmit={handleSave} className="d-flex flex-column gap-4">
        {/* HERO SECTION CMS */}
        <div className="p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
          <h5 className="font-serif fw-bold text-white mb-3" style={{ color: 'var(--color-gold) !important' }}>1. Hero Banner</h5>
          
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label-luxury">Hero Heading Title *</label>
              <input 
                type="text" 
                name="title" 
                className="form-control form-luxury"
                value={homepage.hero.title}
                onChange={handleHeroChange}
                required
              />
              <div className={`char-counter ${!isHeroTitleValid ? 'error' : ''}`}>
                {homepage.hero.title.length} / 80 characters (min 10)
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label-luxury">Hero Background Image URL *</label>
              <input 
                type="text" 
                name="image" 
                className="form-control form-luxury"
                value={homepage.hero.image}
                onChange={handleHeroChange}
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label-luxury">Hero Subtitle *</label>
              <textarea 
                name="subtitle" 
                className="form-control form-luxury"
                rows="2"
                value={homepage.hero.subtitle}
                onChange={handleHeroChange}
                required
              ></textarea>
              <div className={`char-counter ${!isHeroSubtitleValid ? 'error' : ''}`}>
                {homepage.hero.subtitle.length} / 250 characters (min 30)
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label-luxury">CTA Button Label *</label>
              <input 
                type="text" 
                name="buttonText" 
                className="form-control form-luxury"
                value={homepage.hero.buttonText}
                onChange={handleHeroChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label-luxury">CTA Button Destination Path *</label>
              <input 
                type="text" 
                name="buttonLink" 
                className="form-control form-luxury"
                value={homepage.hero.buttonLink}
                onChange={handleHeroChange}
                required
              />
            </div>
          </div>
        </div>

        {/* WELCOME SECTION CMS */}
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
              <label className="form-label-luxury">Section Image URL *</label>
              <input 
                type="text" 
                name="image" 
                className="form-control form-luxury"
                value={homepage.welcome.image}
                onChange={handleWelcomeChange}
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label-luxury">Retreat Description Description *</label>
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

        {/* SECTION HEADINGS CMS */}
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
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label-luxury">Services Title *</label>
              <input type="text" name="title" className="form-control form-luxury" value={homepage.servicesSection.title} onChange={e => handleSectionChange('servicesSection', e)} required />
            </div>
            <div className="col-md-6">
              <label className="form-label-luxury">Services Subtitle *</label>
              <input type="text" name="subtitle" className="form-control form-luxury" value={homepage.servicesSection.subtitle} onChange={e => handleSectionChange('servicesSection', e)} required />
            </div>
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label-luxury">Experiences Title *</label>
              <input type="text" name="title" className="form-control form-luxury" value={homepage.experiencesSection.title} onChange={e => handleSectionChange('experiencesSection', e)} required />
            </div>
            <div className="col-md-6">
              <label className="form-label-luxury">Experiences Subtitle *</label>
              <input type="text" name="subtitle" className="form-control form-luxury" value={homepage.experiencesSection.subtitle} onChange={e => handleSectionChange('experiencesSection', e)} required />
            </div>
          </div>
        </div>

        {/* FAQS CMS */}
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
          className="btn btn-luxury py-3 px-5 align-self-start" 
          disabled={saving || !isFormValid}
        >
          {saving ? 'Updating CMS...' : 'Save All Changes'}
        </button>
      </form>
    </div>
  );
};

export default CmsHomepage;

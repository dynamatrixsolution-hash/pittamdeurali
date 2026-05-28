import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const CmsSettings = () => {
  const [settings, setSettings] = useState({
    hotelName: '',
    address: '',
    phone: '',
    email: '',
    whatsappNumber: '',
    googleMapIframe: '',
    facebookUrl: '',
    instagramUrl: '',
    tripAdvisorUrl: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.success && res.data) {
          setSettings(res.data);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  // --- Strict Validations ---
  const isHotelNameValid = settings.hotelName.length >= 3 && settings.hotelName.length <= 60;
  const isAddressValid = settings.address.length >= 10 && settings.address.length <= 150;
  const isFormValid = isHotelNameValid && isAddressValid && settings.phone && settings.email && settings.whatsappNumber;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setMsg({ type: 'danger', text: 'Validation Error: Check character lengths.' });
      return;
    }

    setSaving(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await api.put('/settings', settings);
      if (res.success) {
        setMsg({ type: 'success', text: 'Hotel settings saved successfully!' });
      }
    } catch (err) {
      setMsg({ type: 'danger', text: typeof err === 'string' ? err : 'Save failed.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center p-5 text-secondary"><div className="spinner-border spinner-luxury" /></div>;
  }

  return (
    <div className="fade-in-up">
      <h3 className="font-serif fw-bold mb-4 text-white">Hotel Settings CMS</h3>
      
      {msg.text && <div className={`alert alert-${msg.type} rounded-0 py-2`}>{msg.text}</div>}

      <form onSubmit={handleSave} className="p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
        <div className="row g-3 mb-4">
          <h5 className="font-serif fw-bold text-white mb-2" style={{ color: 'var(--color-gold) !important' }}>Identity & Coordinates</h5>
          
          <div className="col-md-6">
            <label className="form-label-luxury">Hotel / Brand Name *</label>
            <input 
              type="text" 
              name="hotelName" 
              className="form-control form-luxury"
              value={settings.hotelName}
              onChange={handleChange}
              required
            />
            <div className={`char-counter ${!isHotelNameValid ? 'error' : ''}`}>
              {settings.hotelName.length} / 60 characters (min 3)
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label-luxury">Address Location *</label>
            <input 
              type="text" 
              name="address" 
              className="form-control form-luxury"
              value={settings.address}
              onChange={handleChange}
              required
            />
            <div className={`char-counter ${!isAddressValid ? 'error' : ''}`}>
              {settings.address.length} / 150 characters (min 10)
            </div>
          </div>

          <div className="col-md-4">
            <label className="form-label-luxury">Phone Desk *</label>
            <input 
              type="text" 
              name="phone" 
              className="form-control form-luxury"
              value={settings.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label-luxury">Primary Booking Email *</label>
            <input 
              type="email" 
              name="email" 
              className="form-control form-luxury"
              value={settings.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label-luxury">WhatsApp Number (e.g. 9779801234567) *</label>
            <input 
              type="text" 
              name="whatsappNumber" 
              className="form-control form-luxury"
              value={settings.whatsappNumber}
              onChange={handleChange}
              placeholder="Country code followed by digits"
              required
            />
          </div>
        </div>

        <div className="row g-3 mb-4 border-top pt-4" style={{ borderColor: 'var(--border-color)' }}>
          <h5 className="font-serif fw-bold text-white mb-2" style={{ color: 'var(--color-gold) !important' }}>Map Integration</h5>
          
          <div className="col-12">
            <label className="form-label-luxury">Google Map Iframe Embed URL (src="..." attribute only) *</label>
            <textarea 
              name="googleMapIframe" 
              className="form-control form-luxury"
              rows="3"
              value={settings.googleMapIframe}
              onChange={handleChange}
              required
            ></textarea>
          </div>
        </div>

        <div className="row g-3 mb-4 border-top pt-4" style={{ borderColor: 'var(--border-color)' }}>
          <h5 className="font-serif fw-bold text-white mb-2" style={{ color: 'var(--color-gold) !important' }}>Social Accounts</h5>
          
          <div className="col-md-4">
            <label className="form-label-luxury">Facebook URL</label>
            <input 
              type="url" 
              name="facebookUrl" 
              className="form-control form-luxury"
              value={settings.facebookUrl}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label-luxury">Instagram URL</label>
            <input 
              type="url" 
              name="instagramUrl" 
              className="form-control form-luxury"
              value={settings.instagramUrl}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label-luxury">TripAdvisor URL</label>
            <input 
              type="url" 
              name="tripAdvisorUrl" 
              className="form-control form-luxury"
              value={settings.tripAdvisorUrl}
              onChange={handleChange}
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-luxury px-5 py-3 mt-2"
          disabled={saving || !isFormValid}
        >
          {saving ? 'Saving Coordinates...' : 'Save Configuration'}
        </button>
      </form>
    </div>
  );
};

export default CmsSettings;

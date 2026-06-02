import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import WeatherWidget from '../../components/WeatherWidget';

const Contact = () => {
  const [settings, setSettings] = useState({
    hotelName: 'New Pittam Deurali Guest House & Restaurant',
    address: 'Pittam Deurali, Lumle 33700, Kaski, Nepal',
    phone: '+977-9801234567',
    email: 'stay@newpittamdeurali.com',
    whatsappNumber: '9779801234567',
    googleMapIframe: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3512.522204907997!2d83.82256137530612!3d28.330925975829672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3995ebdc4ec5418b%3A0xe54e60ef2b1c6096!2sPitam%20Deurali!5e0!3m2!1sen!2snp!4v1717200000000!5m2!1sen!2snp',
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guestsCount: 1,
    checkIn: '',
    checkOut: '',
    message: ''
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.success && res.data) {
          setSettings(res.data);
        }
      } catch (err) {
        console.error('Contact page settings loading error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isNameValid = formData.name.length >= 3 && formData.name.length <= 50;
  const isMessageValid = formData.message.length >= 20 && formData.message.length <= 400;
  const isFormValid = isNameValid && isMessageValid && formData.email;

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!isFormValid) {
      setErrorMsg('Please check input character constraints.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await api.post('/inquiries', formData);

      if (res.success) {
        setSuccessMsg('Your message inquiry has been logged successfully!');

        const subject = encodeURIComponent('Guest House Inquiry');
        const bodyText = `Hello New Pittam Deurali Team,

I would like to inquire about availability and services.

Guest Information:
- Name: ${formData.name}
- Guests: ${formData.guestsCount || '1'}
- Check-in: ${formData.checkIn || 'Not specified'}
- Check-out: ${formData.checkOut || 'Not specified'}

Message:
${formData.message}

Thank you.`;

        const mailtoUrl = `mailto:${settings.email}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;

        setTimeout(() => {
          window.location.href = mailtoUrl;
        }, 1000);

        setFormData({
          name: '',
          email: '',
          phone: '',
          guestsCount: 1,
          checkIn: '',
          checkOut: '',
          message: ''
        });
      }
    } catch (err) {
      setErrorMsg(typeof err === 'string' ? err : 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Google Maps Coordinates details for Pitam Deurali
  const latitude = 28.33183;
  const longitude = 83.82475;

  const handleDirections = (mode) => {
    let url = '';
    if (mode === 'navigate') {
      // Direct navigation turn-by-turn
      url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving&dir_action=navigate`;
    } else if (mode === 'route') {
      // General route view
      url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    } else {
      // Search marker view
      url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    }
    window.open(url, '_blank');
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
      {/* Page Header */}
      <div className="row justify-content-center text-center mb-5">
        <div className="col-lg-8 col-11">
          <h6 className="text-uppercase fw-semibold" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em', fontSize: '0.75rem' }}>
            Contact Us
          </h6>
          <h1 className="display-4 font-serif fw-bold my-2">Contact & Location</h1>
          <div className="gold-accent-line"></div>
          <p className="lead text-secondary" style={{ fontSize: '1rem' }}>
            Get in touch with our family-operated booking office or find directions to our ridge-top property.
          </p>
        </div>
      </div>

      {/* Left Column: Coordinates & Inquiry | Right Column: Live Map & Routing */}
      <div className="row g-5 mb-5">
        <div className="col-lg-6 col-12">
          {/* Coordinates details */}
          <div className="p-4 mb-4" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
            <h4 className="font-serif fw-bold mb-4" style={{ color: 'var(--color-gold)' }}>Our Coordinates</h4>
            
            <div className="d-flex flex-column gap-4">
              <div className="d-flex align-items-start gap-3">
                <div className="fs-4 text-gold" style={{ color: 'var(--color-gold)' }}><i className="bi bi-geo-alt"></i></div>
                <div>
                  <h6 className="text-uppercase fw-bold small mb-1" style={{ letterSpacing: '0.05em' }}>Address Location</h6>
                  <p className="small text-secondary mb-0">{settings.address}</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <div className="fs-4 text-gold" style={{ color: 'var(--color-gold)' }}><i className="bi bi-telephone"></i></div>
                <div>
                  <h6 className="text-uppercase fw-bold small mb-1" style={{ letterSpacing: '0.05em' }}>Phone Desk</h6>
                  <p className="small text-secondary mb-0">{settings.phone}</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <div className="fs-4 text-gold" style={{ color: 'var(--color-gold)' }}><i className="bi bi-envelope"></i></div>
                <div>
                  <h6 className="text-uppercase fw-bold small mb-1" style={{ letterSpacing: '0.05em' }}>Email Inbox</h6>
                  <p className="small text-secondary mb-0">{settings.email}</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <div className="fs-4 text-gold" style={{ color: 'var(--color-gold)' }}><i className="bi bi-whatsapp"></i></div>
                <div>
                  <h6 className="text-uppercase fw-bold small mb-1" style={{ letterSpacing: '0.05em' }}>WhatsApp Direct</h6>
                  <p className="small text-secondary mb-0">+{settings.whatsappNumber}</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <div className="fs-4 text-gold" style={{ color: 'var(--color-gold)' }}><i className="bi bi-pin-map"></i></div>
                <div>
                  <h6 className="text-uppercase fw-bold small mb-1" style={{ letterSpacing: '0.05em' }}>Coordinates</h6>
                  <p className="small text-secondary mb-0">Latitude: {latitude} &deg;N &bull; Longitude: {longitude} &deg;E</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
            <h4 className="font-serif fw-bold mb-4">Send A Message</h4>

            {successMsg && <div className="alert alert-success rounded-0 small py-2">{successMsg}</div>}
            {errorMsg && <div className="alert alert-danger rounded-0 small py-2">{errorMsg}</div>}

            <form onSubmit={handleInquirySubmit} className="d-flex flex-column gap-3">
              <div className="row g-3">
                <div className="col-md-6 col-12">
                  <label className="form-label-luxury">Full Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    className="form-control form-luxury" 
                    value={formData.name}
                    onChange={handleChange}
                    required 
                  />
                  <div className={`char-counter ${formData.name.length > 50 || (formData.name.length > 0 && formData.name.length < 3) ? 'error' : ''}`}>
                    {formData.name.length} / 50 characters (min 3)
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <label className="form-label-luxury">Email Address *</label>
                  <input 
                    type="email" 
                    name="email" 
                    className="form-control form-luxury" 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6 col-12">
                  <label className="form-label-luxury">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    className="form-control form-luxury" 
                    value={formData.phone}
                    onChange={handleChange} 
                  />
                </div>
                <div className="col-md-6 col-12">
                  <label className="form-label-luxury">Number of Guests</label>
                  <input 
                    type="number" 
                    name="guestsCount" 
                    className="form-control form-luxury" 
                    min="1" 
                    value={formData.guestsCount}
                    onChange={handleChange} 
                  />
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6 col-12">
                  <label className="form-label-luxury">Check-in Date</label>
                  <input 
                    type="date" 
                    name="checkIn" 
                    className="form-control form-luxury" 
                    value={formData.checkIn}
                    onChange={handleChange} 
                  />
                </div>
                <div className="col-md-6 col-12">
                  <label className="form-label-luxury">Check-out Date</label>
                  <input 
                    type="date" 
                    name="checkOut" 
                    className="form-control form-luxury" 
                    value={formData.checkOut}
                    onChange={handleChange} 
                  />
                </div>
              </div>

              <div>
                <label className="form-label-luxury">Message *</label>
                <textarea 
                  name="message" 
                  className="form-control form-luxury" 
                  rows="4" 
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
                <div className={`char-counter ${formData.message.length > 400 || (formData.message.length > 0 && formData.message.length < 20) ? 'error' : ''}`}>
                  {formData.message.length} / 400 characters (min 20)
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-blue py-3 w-100"
                disabled={submitting || !isFormValid}
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Live Map and Routing options */}
        <div className="col-lg-6 col-12 d-flex flex-column gap-4">
          {/* Map Preview */}
          <div className="p-2" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ height: '380px', borderRadius: '4px', overflow: 'hidden' }}>
              <iframe 
                src={settings.googleMapIframe}
                title="Google Map Location"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Navigation Controls Card */}
          <div className="p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
            <h4 className="font-serif fw-bold mb-3">Live Route & Directions</h4>
            <p className="small text-secondary mb-4">
              Get directions from your current location directly to New Pittam Deurali Guest House & Restaurant in Lumle. Clicking below will open navigation routes.
            </p>

            <div className="d-flex flex-column gap-2">
              <button 
                onClick={() => handleDirections('route')}
                className="btn btn-orange w-100 py-3 text-uppercase font-serif fw-bold d-flex align-items-center justify-content-center gap-2"
                style={{ fontSize: '0.85rem' }}
              >
                <i className="bi bi-map-fill"></i> Get Directions
              </button>

              <div className="row g-2">
                <div className="col-6">
                  <button 
                    onClick={() => handleDirections('marker')}
                    className="btn btn-blue-outline w-100 py-2.5 d-flex align-items-center justify-content-center gap-2"
                    style={{ fontSize: '0.75rem' }}
                  >
                    <i className="bi bi-geo-alt"></i> Open in Maps
                  </button>
                </div>
                <div className="col-6">
                  <button 
                    onClick={() => handleDirections('navigate')}
                    className="btn btn-success w-100 py-2.5 text-white d-flex align-items-center justify-content-center gap-2"
                    style={{ fontSize: '0.75rem', border: 'none' }}
                  >
                    <i className="bi bi-cursor-fill"></i> Navigate Now
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-top text-secondary small" style={{ borderColor: 'var(--border-color)', fontSize: '0.8rem' }}>
              <h6 className="fw-semibold mb-2 text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>Trekkers Travel Route</h6>
              <ul className="mb-0 ps-3">
                <li>Drive from Pokhara to Kande (approx. 45 minutes) via Baglung Highway.</li>
                <li>Trek from Kande to Pitam Deurali (approx. 2 to 2.5 hours walk).</li>
                <li>Our guest house is located right on the ridge where the trails meet.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Forecast Widget */}
      <div className="row">
        <div className="col-12">
          <WeatherWidget />
        </div>
      </div>
    </div>
  );
};

export default Contact;

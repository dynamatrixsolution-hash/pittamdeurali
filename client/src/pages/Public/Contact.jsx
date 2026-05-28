import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Contact = () => {
  const [settings, setSettings] = useState({
    hotelName: 'Sanctum Retreat Pokhara',
    address: 'Lakeside Road, Ward 6, Pokhara, Nepal',
    phone: '+977-61-460000',
    email: 'stay@sanctumpokhara.com',
    whatsappNumber: '9779801234567',
    googleMapIframe: '',
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

  // Form Field Validation Check
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

        const subject = encodeURIComponent('Hotel Inquiry');
        const bodyText = `Hello Hotel Team,

I would like to inquire about room availability.

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
            Contact Us
          </h6>
          <h1 className="display-4 font-serif fw-bold my-2 text-white">Reach Our Sanctuary</h1>
          <div className="gold-accent-line"></div>
          <p className="lead text-secondary" style={{ fontSize: '1rem' }}>
            Get in touch with our booking office or guest services coordinates to plan your journey.
          </p>
        </div>
      </div>

      <div className="row g-5 mb-5">
        {/* Contact Coordinates */}
        <div className="col-lg-5">
          <div className="p-4 h-100" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
            <h4 className="font-serif fw-bold mb-4" style={{ color: 'var(--color-gold)' }}>Coordinates</h4>
            
            <div className="d-flex flex-column gap-4">
              <div className="d-flex align-items-start gap-3">
                <div className="fs-4" style={{ color: 'var(--color-gold)' }}><i className="bi bi-geo-alt"></i></div>
                <div>
                  <h6 className="text-uppercase fw-bold small text-white mb-1" style={{ letterSpacing: '0.05em' }}>Retreat Address</h6>
                  <p className="small text-secondary mb-0">{settings.address}</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <div className="fs-4" style={{ color: 'var(--color-gold)' }}><i className="bi bi-telephone"></i></div>
                <div>
                  <h6 className="text-uppercase fw-bold small text-white mb-1" style={{ letterSpacing: '0.05em' }}>Booking Desk</h6>
                  <p className="small text-secondary mb-0">{settings.phone}</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <div className="fs-4" style={{ color: 'var(--color-gold)' }}><i className="bi bi-envelope"></i></div>
                <div>
                  <h6 className="text-uppercase fw-bold small text-white mb-1" style={{ letterSpacing: '0.05em' }}>Email Inquiries</h6>
                  <p className="small text-secondary mb-0">{settings.email}</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <div className="fs-4" style={{ color: 'var(--color-gold)' }}><i className="bi bi-whatsapp"></i></div>
                <div>
                  <h6 className="text-uppercase fw-bold small text-white mb-1" style={{ letterSpacing: '0.05em' }}>WhatsApp Direct</h6>
                  <p className="small text-secondary mb-0">+{settings.whatsappNumber}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="col-lg-7">
          <div className="p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
            <h4 className="font-serif fw-bold mb-4 text-white">Send a Message</h4>

            {successMsg && <div className="alert alert-success rounded-0 small py-2">{successMsg}</div>}
            {errorMsg && <div className="alert alert-danger rounded-0 small py-2">{errorMsg}</div>}

            <form onSubmit={handleInquirySubmit} className="d-flex flex-column gap-3">
              <div className="row g-3">
                <div className="col-md-6">
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
                <div className="col-md-6">
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
                <div className="col-md-6">
                  <label className="form-label-luxury">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    className="form-control form-luxury" 
                    value={formData.phone}
                    onChange={handleChange} 
                  />
                </div>
                <div className="col-md-6">
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
                <div className="col-md-6">
                  <label className="form-label-luxury">Check-in Date</label>
                  <input 
                    type="date" 
                    name="checkIn" 
                    className="form-control form-luxury" 
                    value={formData.checkIn}
                    onChange={handleChange} 
                  />
                </div>
                <div className="col-md-6">
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
                className="btn btn-luxury py-3 w-100"
                disabled={submitting || !isFormValid}
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Map Embed */}
      {settings.googleMapIframe && (
        <div style={{ height: '360px', border: '1px solid var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
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
      )}
    </div>
  );
};

export default Contact;

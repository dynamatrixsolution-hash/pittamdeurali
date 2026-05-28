import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';

const RoomDetail = () => {
  const { slug } = useParams();
  const [room, setRoom] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    guestsCount: 1,
    checkIn: '',
    checkOut: '',
    message: ''
  });

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const res = await api.get(`/rooms/${slug}`);
        if (res.success) {
          setRoom(res.data);
          setActiveImage(res.data.images[0]);
        }
      } catch (err) {
        console.error('Error fetching room details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoomDetails();
  }, [slug]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validation checks
  const isNameValid = formData.guestName.length >= 3 && formData.guestName.length <= 50;
  const isMessageValid = formData.message.length === 0 || (formData.message.length >= 20 && formData.message.length <= 400);
  const isFormValid = isNameValid && isMessageValid && formData.guestEmail && formData.guestPhone && formData.checkIn && formData.checkOut;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!isFormValid) {
      setErrorMsg('Please ensure all inputs conform to character limitations.');
      return;
    }

    setSubmitting(true);

    try {
      // 1. Save booking inquiry to MongoDB
      const res = await api.post('/bookings', {
        room: room._id,
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone,
        guestsCount: formData.guestsCount,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        message: formData.message
      });

      if (res.success) {
        setSuccessMsg('Your reservation request has been logged successfully!');
        
        // 2. Generate and trigger Mailto pre-filled professional template
        const subject = encodeURIComponent('Hotel Inquiry');
        const bodyText = `Hello Hotel Team,

I would like to inquire about room availability for "${room.title}".

Guest Information:
- Name: ${formData.guestName}
- Guests: ${formData.guestsCount}
- Check-in: ${formData.checkIn}
- Check-out: ${formData.checkOut}

Message:
${formData.message || 'No additional message.'}

Thank you.`;

        const mailtoUrl = `mailto:stay@sanctumpokhara.com?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
        
        // Trigger mailto after brief delay
        setTimeout(() => {
          window.location.href = mailtoUrl;
        }, 1000);

        // Reset form
        setFormData({
          guestName: '',
          guestEmail: '',
          guestPhone: '',
          guestsCount: 1,
          checkIn: '',
          checkOut: '',
          message: ''
        });
      }
    } catch (err) {
      setErrorMsg(typeof err === 'string' ? err : 'Failed to log inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getAPIImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url}`;
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

  if (!room) {
    return (
      <div className="container py-5 text-center">
        <h3 className="font-serif my-5">Accommodation not found.</h3>
        <Link to="/rooms" className="btn btn-luxury">Explore Rooms</Link>
      </div>
    );
  }

  return (
    <div className="container py-5 fade-in-up">
      <Link to="/rooms" className="text-decoration-none small d-inline-flex align-items-center mb-4" style={{ color: 'var(--color-gold)' }}>
        <i className="bi bi-arrow-left me-2"></i> Back to Rooms
      </Link>

      <div className="row g-5">
        {/* Gallery Slider */}
        <div className="col-lg-7">
          <h1 className="font-serif fw-bold mb-3 text-white">{room.title}</h1>
          <div className="gold-accent-line left mb-4"></div>
          
          <div className="mb-3" style={{ height: '420px', border: '1px solid var(--border-color)', overflow: 'hidden', borderRadius: '4px' }}>
            <img 
              src={getAPIImageUrl(activeImage)} 
              alt={room.title} 
              className="w-100 h-100" 
              style={{ objectFit: 'cover' }}
            />
          </div>

          <div className="row g-2">
            {room.images.map((img, idx) => (
              <div className="col-2" key={idx} style={{ cursor: 'pointer' }} onClick={() => setActiveImage(img)}>
                <div style={{ height: '60px', border: activeImage === img ? '1.5px solid var(--color-gold)' : '1px solid var(--border-color)', overflow: 'hidden', borderRadius: '2px' }}>
                  <img src={getAPIImageUrl(img)} alt="" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                </div>
              </div>
            ))}
          </div>

          <h5 className="font-serif fw-bold mt-5 mb-3 text-white">Chamber Overview</h5>
          <p className="lh-lg text-secondary" style={{ textAlign: 'justify', fontSize: '0.9rem' }}>{room.description}</p>
        </div>

        {/* Specifications and Form Sidebar */}
        <div className="col-lg-5">
          {/* Specifications Card */}
          <div className="p-4 mb-4" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
            <h4 className="font-serif fw-bold mb-3 text-white" style={{ color: 'var(--color-gold) !important' }}>Chamber Specs</h4>
            <div className="d-flex flex-column gap-3 small">
              <div className="d-flex justify-content-between border-bottom pb-2" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-secondary">Capacity</span>
                <span className="fw-semibold text-white">{room.capacity} Guests</span>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-2" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-secondary">Bed Type</span>
                <span className="fw-semibold text-white">{room.bedType}</span>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-2" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-secondary">Room Size</span>
                <span className="fw-semibold text-white">{room.roomSize}</span>
              </div>
              <div className="d-flex justify-content-between pb-1">
                <span className="text-secondary">Rate per night</span>
                <span className="fw-bold fs-5 text-white" style={{ color: 'var(--color-gold)' }}>${room.price}</span>
              </div>
            </div>

            <h6 className="text-uppercase fw-semibold mt-4 mb-2 text-white" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
              Included Amenities
            </h6>
            <div className="d-flex flex-wrap gap-1">
              {room.amenities.map((am, i) => (
                <span className="badge rounded-0 bg-transparent text-secondary border px-2 py-1" style={{ fontSize: '0.7rem', borderColor: 'var(--border-color)' }} key={i}>
                  {am}
                </span>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
            <h4 className="font-serif fw-bold mb-4 text-white">Inquire Availability</h4>
            
            {successMsg && <div className="alert alert-success rounded-0 small py-2">{successMsg}</div>}
            {errorMsg && <div className="alert alert-danger rounded-0 small py-2">{errorMsg}</div>}

            <form onSubmit={handleBookingSubmit} className="d-flex flex-column gap-3">
              <div>
                <label className="form-label-luxury">Full Name *</label>
                <input 
                  type="text" 
                  name="guestName"
                  className="form-control form-luxury" 
                  value={formData.guestName}
                  onChange={handleChange}
                  required
                />
                <div className={`char-counter ${formData.guestName.length > 50 || (formData.guestName.length > 0 && formData.guestName.length < 3) ? 'error' : ''}`}>
                  {formData.guestName.length} / 50 characters (min 3)
                </div>
              </div>

              <div className="row g-2">
                <div className="col-md-6">
                  <label className="form-label-luxury">Email Address *</label>
                  <input 
                    type="email" 
                    name="guestEmail"
                    className="form-control form-luxury" 
                    value={formData.guestEmail}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label-luxury">Phone Number *</label>
                  <input 
                    type="tel" 
                    name="guestPhone"
                    className="form-control form-luxury" 
                    value={formData.guestPhone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row g-2">
                <div className="col-md-6">
                  <label className="form-label-luxury">Check-in Date *</label>
                  <input 
                    type="date" 
                    name="checkIn"
                    className="form-control form-luxury" 
                    value={formData.checkIn}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label-luxury">Check-out Date *</label>
                  <input 
                    type="date" 
                    name="checkOut"
                    className="form-control form-luxury" 
                    value={formData.checkOut}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label-luxury">Number of Guests *</label>
                <input 
                  type="number" 
                  name="guestsCount"
                  className="form-control form-luxury" 
                  value={formData.guestsCount}
                  onChange={handleChange}
                  min="1"
                  max={room.capacity}
                  required
                />
              </div>

              <div>
                <label className="form-label-luxury">Special Requests / Message</label>
                <textarea 
                  name="message"
                  className="form-control form-luxury" 
                  value={formData.message}
                  onChange={handleChange}
                  rows="3"
                ></textarea>
                <div className={`char-counter ${formData.message.length > 400 || (formData.message.length > 0 && formData.message.length < 20) ? 'error' : ''}`}>
                  {formData.message.length} / 400 characters (min 20 if entered)
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-luxury w-100 mt-2 py-3" 
                disabled={submitting || !isFormValid}
              >
                {submitting ? 'Processing Inquiry...' : 'Submit Inquiry'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;

import React, { useState, useEffect } from 'react';
import api, { getAPIImageUrl } from '../../services/api';
import SEO from '../../components/SEO/SEO';
import { Link } from 'react-router-dom';

const Booking = () => {
  const [rooms, setRooms] = useState([]);
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
    selectedRoomId: '',
    message: ''
  });

  const [settings, setSettings] = useState({
    hotelName: 'Pitam Deurali Guest House',
    email: 'stay@pittamdeuraliguesthouse.com',
    whatsappNumber: '9779801234567'
  });

  useEffect(() => {
    const fetchRoomsAndSettings = async () => {
      try {
        const [roomsRes, settingsRes] = await Promise.all([
          api.get('/rooms'),
          api.get('/settings')
        ]);
        if (roomsRes.success) setRooms(roomsRes.data);
        if (settingsRes.success && settingsRes.data) setSettings(settingsRes.data);
      } catch (err) {
        console.error('Error fetching booking requirements:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoomsAndSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validation
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
      const selectedRoom = rooms.find(r => r._id === formData.selectedRoomId);
      const roomTitle = selectedRoom ? selectedRoom.title : 'General Stay';

      const res = await api.post('/bookings', {
        room: formData.selectedRoomId || null,
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
        
        const subject = encodeURIComponent('Room Booking Inquiry - Pitam Deurali');
        const bodyText = `Hello ${settings.hotelName},

I would like to make a booking inquiry.

Booking Details:
- Room: ${roomTitle}
- Guest Name: ${formData.guestName}
- Phone: ${formData.guestPhone}
- Email: ${formData.guestEmail}
- Guests: ${formData.guestsCount}
- Check-in: ${formData.checkIn}
- Check-out: ${formData.checkOut}

Message:
${formData.message || 'No additional details.'}

Thank you.`;

        const mailtoUrl = `mailto:${settings.email}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
        
        setTimeout(() => {
          window.location.href = mailtoUrl;
        }, 1000);

        setFormData({
          guestName: '',
          guestEmail: '',
          guestPhone: '',
          guestsCount: 1,
          checkIn: '',
          checkOut: '',
          selectedRoomId: '',
          message: ''
        });
      }
    } catch (err) {
      setErrorMsg(typeof err === 'string' ? err : 'Failed to log booking request. Please try again.');
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
    <div className="fade-in-up">
      <SEO 
        title="Book Your Room | Pitam Deurali Guest House Pothana"
        description="Reserve your room online at Pitam Deurali Guest House in Pothana. Best rates guaranteed for Mardi Himal trekkers, couples, families, and backpackers."
        keywords={[
          "Book Pitam Deurali Guest House", "Pothana Guest House Reservation", "Deurali Guest House Booking",
          "Hotel in Pothana Rates", "Hotel in Dhampus Booking", "Stay in Pothana Online Booking",
          "Mardi Himal Accommodation Reservation", "Annapurna Trek Lodge Rates", "Best Guest House in Dhampus Booking",
          "Budget Hotel Dhampus Rates", "Pokhara Trekking Stay Reservation", "Himalayan View Accommodation Booking",
          "Family Guest House Nepal Reservation", "Trekker Friendly Lodge Booking", "Gandaki Province Lodge Reservation"
        ]}
        slug="/booking"
      />

      {/* Hero Section */}
      <section className="hero-slider" style={{ height: '40vh', minHeight: '350px' }}>
        <div className="hero-slide active" style={{ backgroundImage: `url('${getAPIImageUrl('/uploads/image copy.png')}')` }}>
          <div className="hero-slide-overlay" style={{ background: 'rgba(0,0,0,0.5)' }}></div>
          <div className="hero-slide-content">
            <div className="container text-center">
              <h6 className="text-uppercase fw-semibold" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em', fontSize: '0.85rem', marginBottom: '15px' }}>
                Secure Your Stay
              </h6>
              <h1 className="display-4 fw-bold font-serif text-white">Make a Reservation</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form & Info Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="row g-5">
            
            {/* Left Column: Form */}
            <div className="col-lg-8">
              <div className="card-luxury p-md-5 p-4 shadow-sm" style={{ borderTop: '4px solid var(--color-gold)' }}>
                <h3 className="font-serif fw-bold mb-2">Guest Details</h3>
                <p className="text-secondary small mb-4">Please fill in your details to inquire about availability. We will respond quickly.</p>
                
                {successMsg && <div className="alert alert-success rounded-2 small py-3 mb-4 border-0 bg-success bg-opacity-10 text-success fw-bold"><i className="bi bi-check-circle-fill me-2"></i> {successMsg}</div>}
                {errorMsg && <div className="alert alert-danger rounded-2 small py-3 mb-4 border-0 bg-danger bg-opacity-10 text-danger fw-bold"><i className="bi bi-exclamation-triangle-fill me-2"></i> {errorMsg}</div>}

                <form onSubmit={handleBookingSubmit} className="d-flex flex-column gap-4">
                  
                  {/* Name */}
                  <div>
                    <label className="form-label fw-semibold text-secondary small">Full Name <span className="text-danger">*</span></label>
                    <input 
                      type="text" 
                      name="guestName"
                      className="form-control form-control-lg bg-light border-0" 
                      value={formData.guestName}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      required
                    />
                    <div className={`small mt-1 text-end ${formData.guestName.length > 50 || (formData.guestName.length > 0 && formData.guestName.length < 3) ? 'text-danger fw-bold' : 'text-muted'}`}>
                      {formData.guestName.length} / 50 characters (min 3)
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary small">Email Address <span className="text-danger">*</span></label>
                      <input 
                        type="email" 
                        name="guestEmail"
                        className="form-control form-control-lg bg-light border-0" 
                        value={formData.guestEmail}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary small">WhatsApp / Phone <span className="text-danger">*</span></label>
                      <input 
                        type="tel" 
                        name="guestPhone"
                        className="form-control form-control-lg bg-light border-0" 
                        value={formData.guestPhone}
                        onChange={handleChange}
                        placeholder="+977 980-XXXXXXX"
                        required
                      />
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary small">Check-in Date <span className="text-danger">*</span></label>
                      <input 
                        type="date" 
                        name="checkIn"
                        className="form-control form-control-lg bg-light border-0" 
                        value={formData.checkIn}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary small">Check-out Date <span className="text-danger">*</span></label>
                      <input 
                        type="date" 
                        name="checkOut"
                        className="form-control form-control-lg bg-light border-0" 
                        value={formData.checkOut}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Room & Guests */}
                  <div className="row g-4">
                    <div className="col-md-8">
                      <label className="form-label fw-semibold text-secondary small">Select Accommodation <span className="text-danger">*</span></label>
                      <select 
                        name="selectedRoomId"
                        className="form-select form-select-lg bg-light border-0" 
                        value={formData.selectedRoomId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">-- Choose Accommodation --</option>
                        {rooms.map(room => (
                          <option key={room._id} value={room._id}>
                            {room.title} (Max {room.capacity} pax)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold text-secondary small">Number of Guests <span className="text-danger">*</span></label>
                      <input 
                        type="number" 
                        name="guestsCount"
                        className="form-control form-control-lg bg-light border-0" 
                        value={formData.guestsCount}
                        onChange={handleChange}
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="form-label fw-semibold text-secondary small">Special Requests / Trail Notes</label>
                    <textarea 
                      name="message"
                      className="form-control form-control-lg bg-light border-0" 
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your estimated arrival time, dietary restrictions, or guide requirements..."
                      rows="4"
                    ></textarea>
                    <div className={`small mt-1 text-end ${formData.message.length > 400 || (formData.message.length > 0 && formData.message.length < 20) ? 'text-danger fw-bold' : 'text-muted'}`}>
                      {formData.message.length} / 400 characters (min 20 if entered)
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg w-100 mt-2 fw-bold text-uppercase" 
                    disabled={submitting || !isFormValid}
                    style={{ letterSpacing: '1px', transition: 'all 0.3s ease' }}
                  >
                    {submitting ? 'Processing Inquiry...' : 'Confirm Availability'}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Sidebar */}
            <div className="col-lg-4">
              <div className="sticky-top" style={{ top: '100px' }}>
                
                {/* Contact Direct Card */}
                <div className="card-luxury p-4 mb-4" style={{ backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
                  <h4 className="font-serif fw-bold mb-3">Instant Booking</h4>
                  <p className="small text-secondary mb-4">Need immediate confirmation? Chat directly with the host family.</p>
                  
                  <a 
                    href={`https://wa.me/${settings.whatsappNumber.replace(/[+\s-]/g, '')}?text=Hi,%20I'm%20interested%20in%20booking%20a%20stay%20at%20Pitam%20Deurali%20Guest%20House.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success w-100 fw-bold d-flex align-items-center justify-content-center gap-2 py-3"
                    style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
                  >
                    <i className="bi bi-whatsapp fs-5"></i> Chat on WhatsApp
                  </a>
                </div>

                {/* Why Book Direct */}
                <div className="card-luxury p-4">
                  <h4 className="font-serif fw-bold mb-4">Why Book Direct?</h4>
                  
                  <div className="d-flex align-items-start mb-4">
                    <div className="text-gold me-3 fs-3" style={{ color: 'var(--color-gold)' }}><i className="bi bi-shield-check"></i></div>
                    <div>
                      <h6 className="fw-bold mb-1">Best Rate Guarantee</h6>
                      <p className="small text-secondary mb-0">By booking direct, you skip OTA commissions and get the absolute best price.</p>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-start mb-4">
                    <div className="text-gold me-3 fs-3" style={{ color: 'var(--color-gold)' }}><i className="bi bi-cup-hot"></i></div>
                    <div>
                      <h6 className="fw-bold mb-1">Authentic Experience</h6>
                      <p className="small text-secondary mb-0">Talk directly with the local family operating the lodge to plan your trek.</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start">
                    <div className="text-gold me-3 fs-3" style={{ color: 'var(--color-gold)' }}><i className="bi bi-stars"></i></div>
                    <div>
                      <h6 className="fw-bold mb-1">Free Cancellation</h6>
                      <p className="small text-secondary mb-0">Plans change in the mountains. We offer flexible cancellation policies.</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Booking;

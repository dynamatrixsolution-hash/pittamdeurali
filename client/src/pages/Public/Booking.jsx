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
    hotelName: 'New Pittam Deurali Guest House and Restaurant',
    email: 'stay@pittamdeuraliguesthouse.com',
    whatsappNumber: '9779866061995',
    phone: '+977-9866061995'
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

  const handleSelectRoom = (roomId) => {
    setFormData((prev) => ({ ...prev, selectedRoomId: roomId }));
  };

  // Calculate nights stay
  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const nightsCount = calculateNights();
  const selectedRoom = rooms.find((r) => r._id === formData.selectedRoomId);

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
      const roomTitle = selectedRoom ? selectedRoom.title : 'General Mountain Lodge Stay';

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
        setSuccessMsg('Your reservation request has been received! Opening your email client to complete submission...');
        
        const subject = encodeURIComponent(`Room Booking Inquiry - ${formData.guestName}`);
        const bodyText = `Hello ${settings.hotelName},

I would like to confirm my room booking request.

Reservation Summary:
- Accommodation: ${roomTitle}
- Guest Name: ${formData.guestName}
- Phone: ${formData.guestPhone}
- Email: ${formData.guestEmail}
- Number of Guests: ${formData.guestsCount}
- Check-in: ${formData.checkIn}
- Check-out: ${formData.checkOut}
- Total Stay Duration: ${nightsCount > 0 ? `${nightsCount} Night(s)` : 'TBD'}

Additional Request / Trail Notes:
${formData.message || 'No additional special requests.'}

Thank you.`;

        const mailtoUrl = `mailto:${settings.email}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
        
        setTimeout(() => {
          window.location.href = mailtoUrl;
        }, 1200);

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
      setErrorMsg(typeof err === 'string' ? err : 'Failed to process reservation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '70vh', color: 'var(--color-gold)' }}>
        <div className="spinner-border spinner-luxury mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="small text-uppercase tracking-wider fw-semibold text-secondary">Preparing Booking Options...</p>
      </div>
    );
  }

  return (
    <div className="fade-in-up">
      <SEO 
        title="Book Your Room & Stay | New Pittam Deurali Guest House"
        description="Reserve cozy mountain view rooms online at New Pittam Deurali Guest House and Restaurant. Best rates guaranteed for Mardi Himal trekkers, couples, and families."
        keywords={[
          "Book Pittam Deurali Guest House", "Pothana Guest House Reservation", "Deurali Guest House Booking",
          "Hotel in Pittam Deurali Rates", "Hotel in Dhampus Booking", "Stay in Deurali Online Booking",
          "Mardi Himal Accommodation Reservation", "Annapurna Trek Lodge Rates", "Best Guest House in Dhampus Booking",
          "Budget Hotel Dhampus Rates", "Pokhara Trekking Stay Reservation", "Himalayan View Accommodation Booking",
          "Family Guest House Nepal Reservation", "Trekker Friendly Lodge Booking"
        ]}
        slug="/booking"
      />

      {/* Luxury Hero Banner */}
      <section 
        className="position-relative d-flex align-items-center justify-content-center text-white" 
        style={{ 
          minHeight: '420px', 
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.85) 100%), url('/images/hero/hero-1.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container position-relative z-1 text-center py-5">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" style={{ backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <i className="bi bi-geo-alt-fill text-warning"></i>
            <span className="small text-uppercase tracking-widest fw-semibold" style={{ fontSize: '0.78rem' }}>Pittam Deurali • Elevation 2,100m</span>
          </div>

          <h1 className="display-4 fw-bold font-serif mb-3 text-white">Reserve Your Stay</h1>
          <p className="lead mx-auto text-light opacity-90" style={{ maxWidth: '680px', fontSize: '1.1rem' }}>
            Experience warm wooden lodging, hot running showers, and authentic wood-fired organic dining on your Annapurna & Mardi Himal trek.
          </p>

          {/* Breadcrumb Navigation */}
          <nav className="d-flex justify-content-center align-items-center gap-2 small text-light opacity-75 mt-4">
            <Link to="/" className="text-white text-decoration-none hover-gold">Home</Link>
            <span>/</span>
            <span className="text-warning fw-semibold">Book Room</span>
          </nav>
        </div>
      </section>

      {/* Main Booking Content */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          
          {/* Trust Badges Bar */}
          <div className="row g-3 mb-5">
            <div className="col-md-4">
              <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <div className="p-3 rounded-circle bg-warning bg-opacity-10 text-warning fs-4"><i className="bi bi-shield-check"></i></div>
                <div>
                  <h6 className="fw-bold mb-0 text-primary-custom">Best Rate Guarantee</h6>
                  <span className="small text-secondary">Book direct with no extra agent fees</span>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success fs-4"><i className="bi bi-lightning-charge"></i></div>
                <div>
                  <h6 className="fw-bold mb-0 text-primary-custom">Instant Host Support</h6>
                  <span className="small text-secondary">Direct WhatsApp & phone assistance</span>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <div className="p-3 rounded-circle bg-info bg-opacity-10 text-info fs-4"><i className="bi bi-box-seam"></i></div>
                <div>
                  <h6 className="fw-bold mb-0 text-primary-custom">Free Luggage Storage</h6>
                  <span className="small text-secondary">Safe bag storage while you trek</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Room Selection Cards Carousel/Grid */}
          {rooms.length > 0 && (
            <div className="mb-5">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <h4 className="font-serif fw-bold mb-1 text-primary-custom">Select Your Preferred Room</h4>
                  <p className="small text-secondary mb-0">Tap any room below to select it for your booking request.</p>
                </div>
                <Link to="/rooms" className="small text-decoration-none hover-gold fw-semibold d-none d-sm-inline-block">
                  View All Room Details <i className="bi bi-arrow-right"></i>
                </Link>
              </div>

              <div className="row g-3">
                {rooms.map((room) => {
                  const isSelected = formData.selectedRoomId === room._id;
                  return (
                    <div className="col-md-4" key={room._id}>
                      <div 
                        onClick={() => handleSelectRoom(room._id)}
                        className={`card h-100 cursor-pointer overflow-hidden transition-smooth ${isSelected ? 'border-primary shadow-lg' : ''}`}
                        style={{ 
                          backgroundColor: 'var(--bg-card)', 
                          border: isSelected ? '2px solid var(--color-gold)' : '1px solid var(--border-color)',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          transform: isSelected ? 'scale(1.02)' : 'none'
                        }}
                      >
                        <div className="position-relative" style={{ height: '160px', overflow: 'hidden' }}>
                          <img 
                            src={getAPIImageUrl(room.images?.[0] || room.image || '/uploads/image.png')} 
                            alt={room.title} 
                            className="w-100 h-100 object-fit-cover"
                          />
                          {isSelected && (
                            <div className="position-absolute top-0 end-0 m-2 px-3 py-1 bg-warning text-dark fw-bold rounded-pill small shadow-sm">
                              <i className="bi bi-check-circle-fill me-1"></i> Selected
                            </div>
                          )}
                        </div>
                        <div className="card-body p-3">
                          <h6 className="fw-bold mb-1 text-primary-custom">{room.title}</h6>
                          <div className="d-flex align-items-center justify-content-between small text-secondary">
                            <span><i className="bi bi-people me-1"></i> Max {room.capacity || 2} Guests</span>
                            {room.price ? <span className="fw-bold text-success">Rs. {room.price} / night</span> : <span className="small text-muted">Inquire Price</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="row g-5">
            
            {/* Left Column: Interactive Form */}
            <div className="col-lg-8">
              <div className="p-4 p-md-5 rounded-4 shadow-sm" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                
                <div className="d-flex align-items-center justify-content-between pb-3 mb-4 border-bottom border-secondary border-opacity-10">
                  <div>
                    <h3 className="font-serif fw-bold mb-1 text-primary-custom">Reservation Details</h3>
                    <p className="text-secondary small mb-0">Fill in your information to request lodging confirmation.</p>
                  </div>
                  <span className="badge bg-warning bg-opacity-20 text-warning px-3 py-2 rounded-pill small fw-bold">
                    <i className="bi bi-clock-history me-1"></i> Quick Response
                  </span>
                </div>

                {successMsg && (
                  <div className="alert alert-success rounded-3 p-3 mb-4 border-0 bg-success bg-opacity-10 text-success fw-bold d-flex align-items-center gap-2">
                    <i className="bi bi-check-circle-fill fs-5"></i>
                    <div>{successMsg}</div>
                  </div>
                )}
                
                {errorMsg && (
                  <div className="alert alert-danger rounded-3 p-3 mb-4 border-0 bg-danger bg-opacity-10 text-danger fw-bold d-flex align-items-center gap-2">
                    <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                    <div>{errorMsg}</div>
                  </div>
                )}

                <form onSubmit={handleBookingSubmit} className="d-flex flex-column gap-4">
                  
                  {/* Selected Room Preview Banner */}
                  {selectedRoom && (
                    <div className="p-3 rounded-3 d-flex align-items-center justify-content-between" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--color-gold)' }}>
                      <div className="d-flex align-items-center gap-3">
                        <img 
                          src={getAPIImageUrl(selectedRoom.images?.[0] || selectedRoom.image || '/uploads/image.png')} 
                          alt={selectedRoom.title} 
                          className="rounded-2 object-fit-cover" 
                          style={{ width: '60px', height: '60px' }}
                        />
                        <div>
                          <div className="small text-uppercase tracking-wider text-warning fw-bold">Selected Room</div>
                          <h6 className="fw-bold mb-0 text-primary-custom">{selectedRoom.title}</h6>
                          <span className="small text-secondary">Capacity: {selectedRoom.capacity} Guests</span>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        className="btn btn-sm btn-outline-secondary rounded-pill"
                        onClick={() => handleSelectRoom('')}
                      >
                        Change
                      </button>
                    </div>
                  )}

                  {/* Room Selection Dropdown */}
                  <div>
                    <label className="form-label fw-semibold text-secondary small">
                      <i className="bi bi-house-door text-warning me-1"></i> Choose Room Category <span className="text-danger">*</span>
                    </label>
                    <select 
                      name="selectedRoomId"
                      className="form-select form-select-lg" 
                      value={formData.selectedRoomId}
                      onChange={handleChange}
                      style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                      required
                    >
                      <option value="">-- Choose Room / Suite --</option>
                      {rooms.map((room) => (
                        <option key={room._id} value={room._id}>
                          {room.title} (Max {room.capacity} Guests) {room.price ? `- Rs. ${room.price}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label className="form-label fw-semibold text-secondary small">
                      <i className="bi bi-person text-warning me-1"></i> Full Name <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="guestName"
                      className="form-control form-control-lg" 
                      value={formData.guestName}
                      onChange={handleChange}
                      placeholder="e.g. Alexander Wright"
                      style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                      required
                    />
                    <div className={`small mt-1 text-end ${formData.guestName.length > 50 || (formData.guestName.length > 0 && formData.guestName.length < 3) ? 'text-danger fw-bold' : 'text-muted'}`}>
                      {formData.guestName.length} / 50 characters (min 3)
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary small">
                        <i className="bi bi-envelope text-warning me-1"></i> Email Address <span className="text-danger">*</span>
                      </label>
                      <input 
                        type="email" 
                        name="guestEmail"
                        className="form-control form-control-lg" 
                        value={formData.guestEmail}
                        onChange={handleChange}
                        placeholder="alexander@example.com"
                        style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary small">
                        <i className="bi bi-telephone text-warning me-1"></i> Phone / WhatsApp <span className="text-danger">*</span>
                      </label>
                      <input 
                        type="tel" 
                        name="guestPhone"
                        className="form-control form-control-lg" 
                        value={formData.guestPhone}
                        onChange={handleChange}
                        placeholder="+977 9866061995"
                        style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                        required
                      />
                    </div>
                  </div>

                  {/* Dates & Guest Count */}
                  <div className="row g-4">
                    <div className="col-md-5">
                      <label className="form-label fw-semibold text-secondary small">
                        <i className="bi bi-calendar-check text-warning me-1"></i> Check-in Date <span className="text-danger">*</span>
                      </label>
                      <input 
                        type="date" 
                        name="checkIn"
                        className="form-control form-control-lg" 
                        value={formData.checkIn}
                        onChange={handleChange}
                        style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                        required
                      />
                    </div>
                    <div className="col-md-5">
                      <label className="form-label fw-semibold text-secondary small">
                        <i className="bi bi-calendar-x text-warning me-1"></i> Check-out Date <span className="text-danger">*</span>
                      </label>
                      <input 
                        type="date" 
                        name="checkOut"
                        className="form-control form-control-lg" 
                        value={formData.checkOut}
                        onChange={handleChange}
                        style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                        required
                      />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label fw-semibold text-secondary small">
                        <i className="bi bi-people text-warning me-1"></i> Guests <span className="text-danger">*</span>
                      </label>
                      <input 
                        type="number" 
                        name="guestsCount"
                        className="form-control form-control-lg" 
                        value={formData.guestsCount}
                        onChange={handleChange}
                        min="1"
                        style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                        required
                      />
                    </div>
                  </div>

                  {/* Live Stay Duration Badge */}
                  {nightsCount > 0 && (
                    <div className="p-3 rounded-3 bg-warning bg-opacity-10 text-warning d-flex align-items-center justify-content-between">
                      <span className="fw-bold"><i className="bi bi-moon-stars me-2"></i> Total Stay Duration:</span>
                      <span className="badge bg-warning text-dark fs-6 px-3 py-1">{nightsCount} Night(s)</span>
                    </div>
                  )}

                  {/* Special Requests */}
                  <div>
                    <label className="form-label fw-semibold text-secondary small">
                      <i className="bi bi-chat-left-text text-warning me-1"></i> Special Requests & Trail Notes
                    </label>
                    <textarea 
                      name="message"
                      className="form-control form-control-lg" 
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Let us know your estimated arrival time, dietary preferences (e.g. Vegetarian/Vegan), or guide/porter requirements..."
                      rows="4"
                      style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                    ></textarea>
                    <div className={`small mt-1 text-end ${formData.message.length > 400 || (formData.message.length > 0 && formData.message.length < 20) ? 'text-danger fw-bold' : 'text-muted'}`}>
                      {formData.message.length} / 400 characters (min 20 if entered)
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    className="btn btn-warning btn-lg w-100 py-3 fw-bold text-uppercase shadow-sm" 
                    disabled={submitting || !isFormValid}
                    style={{ letterSpacing: '1.2px', fontSize: '1rem', transition: 'all 0.3s ease' }}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Sending Inquiry...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send-fill me-2"></i> Submit Reservation Inquiry
                      </>
                    )}
                  </button>

                </form>

              </div>
            </div>

            {/* Right Column: Sticky Contact Sidebar & Assistance */}
            <div className="col-lg-4">
              <div className="sticky-top" style={{ top: '100px', zIndex: 10 }}>
                
                {/* Instant Host WhatsApp Card */}
                <div className="p-4 rounded-4 mb-4 shadow-sm text-center text-white" style={{ background: 'linear-gradient(135deg, #128C7E 0%, #075E54 100%)' }}>
                  <div className="fs-1 mb-2"><i className="bi bi-whatsapp"></i></div>
                  <h4 className="font-serif fw-bold mb-2">Need Urgent Booking?</h4>
                  <p className="small opacity-90 mb-4">Chat directly with the lodge manager on WhatsApp for immediate confirmation.</p>
                  
                  <a 
                    href={`https://wa.me/${settings.whatsappNumber.replace(/[+\s-]/g, '')}?text=Hi%20New%20Pittam%20Deurali,%20I%20want%20to%20inquire%20about%20room%20availability.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-light btn-lg w-100 fw-bold d-flex align-items-center justify-content-center gap-2 text-dark shadow-sm hover-scale"
                    style={{ borderRadius: '8px' }}
                  >
                    <i className="bi bi-chat-dots-fill text-success"></i> Chat on WhatsApp
                  </a>
                </div>

                {/* Direct Phone Assistance */}
                <div className="p-4 rounded-4 mb-4 shadow-sm" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                  <h5 className="font-serif fw-bold mb-3 text-primary-custom"><i className="bi bi-telephone-outbound text-warning me-2"></i> Direct Phone Contact</h5>
                  <p className="small text-secondary mb-3">Call our booking desk directly from Pokhara or on trail:</p>
                  <a href={`tel:${settings.phone}`} className="btn btn-outline-warning w-100 fw-bold py-2 mb-2">
                    <i className="bi bi-telephone-fill me-2"></i> {settings.phone}
                  </a>
                  <span className="small text-muted d-block text-center" style={{ fontSize: '0.8rem' }}>Available 6:00 AM - 9:00 PM (Nepal Time)</span>
                </div>

                {/* Mountain Stay FAQ Collapsible */}
                <div className="p-4 rounded-4 shadow-sm" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                  <h5 className="font-serif fw-bold mb-3 text-primary-custom"><i className="bi bi-question-circle text-warning me-2"></i> Stay FAQs</h5>
                  
                  <div className="accordion accordion-flush" id="bookingFaq">
                    <div className="accordion-item bg-transparent">
                      <h2 className="accordion-header">
                        <button className="accordion-button collapsed bg-transparent text-primary-custom small fw-semibold px-0" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                          Hot Water & Power Supply?
                        </button>
                      </h2>
                      <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#bookingFaq">
                        <div className="accordion-body px-0 small text-secondary">
                          We provide reliable hot running showers and 24/7 charging stations for phones and camera batteries.
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item bg-transparent">
                      <h2 className="accordion-header">
                        <button className="accordion-button collapsed bg-transparent text-primary-custom small fw-semibold px-0" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                          Food & Dining Options?
                        </button>
                      </h2>
                      <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#bookingFaq">
                        <div className="accordion-body px-0 small text-secondary">
                          Our local restaurant serves fresh organic Nepali Dal Bhat cooked on a wood stove, as well as continental meals.
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item bg-transparent">
                      <h2 className="accordion-header">
                        <button className="accordion-button collapsed bg-transparent text-primary-custom small fw-semibold px-0" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                          Luggage Storage?
                        </button>
                      </h2>
                      <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#bookingFaq">
                        <div className="accordion-body px-0 small text-secondary">
                          Yes, we offer complimentary secure bag storage while you hike up to Forest Camp or Mardi Himal.
                        </div>
                      </div>
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

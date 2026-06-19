import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import SEO from '../../components/SEO';

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

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": settings?.hotelName || "New Pitam Deurali Guest House and Restaurant",
    "url": "https://pittamdeuraliguesthouse.com",
    "logo": "https://pittamdeuraliguesthouse.com/logo.png"
  };

  const bookingFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How can I reserve a room at Pitam Deurali Guest House?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can fill out the reservation inquiry form on this booking page or send an instant message on WhatsApp to +977-9866061995 to check live availability and secure your booking."
        }
      },
      {
        "@type": "Question",
        "name": "What details do I need to provide for a booking?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Please provide your full name, email, phone number (preferably WhatsApp-enabled), check-in/out dates, the number of guests in your party, and your preferred room type."
        }
      },
      {
        "@type": "Question",
        "name": "Is there a cancellation fee for booking modifications?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer flexible cancellation and booking modifications. Please let us know at least 24-48 hours in advance if your trekking plans change so we can adjust our room occupancy accordingly."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://pittamdeuraliguesthouse.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Booking",
        "item": "https://pittamdeuraliguesthouse.com/booking"
      }
    ]
  };

  const dynamicBookingSchemas = [organizationSchema, bookingFaqSchema, breadcrumbSchema];

  return (
    <div className="container py-5 fade-in-up">
      <SEO 
        title="Book Your Room | Pitam Deurali Guest House Pothana"
        description="Reserve your room online at Pitam Deurali Guest House in Pothana. Best rates guaranteed for Mardi Himal trekkers, couples, families, and backpackers."
        keywords={[
          "Book Pitam Deurali Guest House", "Pothana Guest House Reservation", "Deurali Guest House Booking",
          "Hotel in Pothana Rates", "Hotel in Dhampus Booking", "Stay in Pothana Online Booking",
          "Mardi Himal Accommodation Reservation", "Annapurna Trek Lodge Rates", "Best Guest House in Dhampus Booking",
          "Budget Hotel Dhampus Rates", "Pokhara Trekking Stay Reservation", "Himalayan View Accommodation Booking",
          "Family Guest House Nepal Reservation", "Trekker Friendly Lodge Booking", "Gandaki Province Lodge Reservation",
          "Book Hotel in Pothana", "Book Guest House in Dhampus", "Book Mardi Himal Accommodation", 
          "Reserve Trekking Lodge Nepal", "Online Booking Pothana Guest House", "Hotel Reservation Dhampus", 
          "Book Stay Near Australian Camp", "Best Guest House Booking Annapurna Trek", 
          "Reserve Room Near Mardi Himal Trek", "Direct Booking Trekking Lodge Nepal"
        ]}
        slug="/booking"
        schema={dynamicBookingSchemas}
      />

      <div className="row justify-content-center text-center mb-5">
        <div className="col-lg-8 col-11">
          <h6 className="text-uppercase fw-semibold" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em', fontSize: '0.75rem' }}>
            Reservations
          </h6>
          <h1 className="display-4 font-serif fw-bold my-2">Book Your Mountain Stay</h1>
          <div className="gold-accent-line"></div>
          <p className="lead text-secondary" style={{ fontSize: '1rem' }}>
            Secure your room at Pitam Deurali Guest House. Enjoy direct booking perks, hot showers, and unparalleled views of the Himalayas.
          </p>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="card-luxury p-5">
            <h3 className="font-serif fw-bold mb-4 text-center">Inquire Availability</h3>
            
            {successMsg && <div className="alert alert-success rounded-0 small py-2 mb-4">{successMsg}</div>}
            {errorMsg && <div className="alert alert-danger rounded-0 small py-2 mb-4">{errorMsg}</div>}

            <form onSubmit={handleBookingSubmit} className="d-flex flex-column gap-3">
              <div>
                <label className="form-label-luxury">Full Name *</label>
                <input 
                  type="text" 
                  name="guestName"
                  className="form-control form-luxury" 
                  value={formData.guestName}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  required
                />
                <div className={`char-counter ${formData.guestName.length > 50 || (formData.guestName.length > 0 && formData.guestName.length < 3) ? 'error' : ''}`}>
                  {formData.guestName.length} / 50 characters (min 3)
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label-luxury">Email Address *</label>
                  <input 
                    type="email" 
                    name="guestEmail"
                    className="form-control form-luxury" 
                    value={formData.guestEmail}
                    onChange={handleChange}
                    placeholder="e.g. john@example.com"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label-luxury">Phone / WhatsApp Number *</label>
                  <input 
                    type="tel" 
                    name="guestPhone"
                    className="form-control form-luxury" 
                    value={formData.guestPhone}
                    onChange={handleChange}
                    placeholder="e.g. +977 980-XXXXXXX"
                    required
                  />
                </div>
              </div>

              <div className="row g-3">
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

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label-luxury">Select Room Type / Accommodation *</label>
                  <select 
                    name="selectedRoomId"
                    className="form-select form-luxury" 
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
                <div className="col-md-6">
                  <label className="form-label-luxury">Number of Guests *</label>
                  <input 
                    type="number" 
                    name="guestsCount"
                    className="form-control form-luxury" 
                    value={formData.guestsCount}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label-luxury">Special Requests / Trail Notes</label>
                <textarea 
                  name="message"
                  className="form-control form-luxury" 
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your flight time, luggage assistance, or diet requests..."
                  rows="4"
                ></textarea>
                <div className={`char-counter ${formData.message.length > 400 || (formData.message.length > 0 && formData.message.length < 20) ? 'error' : ''}`}>
                  {formData.message.length} / 400 characters (min 20 if entered)
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-orange w-100 mt-3 py-3 fw-bold" 
                disabled={submitting || !isFormValid}
              >
                {submitting ? 'Processing Inquiry...' : 'Submit Inquiry'}
              </button>
            </form>

            <div className="text-center mt-4 border-top pt-4" style={{ borderColor: 'var(--border-color)' }}>
              <p className="text-muted small">Prefer instant booking or custom requests?</p>
              <a 
                href={`https://wa.me/${settings.whatsappNumber.replace(/[+\s-]/g, '')}?text=Hi,%20I'm%20interested%20in%20booking%20a%20stay%20at%20Pitam%20Deurali%20Guest%20House.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-success d-inline-flex align-items-center gap-2"
              >
                <i className="bi bi-whatsapp"></i> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;

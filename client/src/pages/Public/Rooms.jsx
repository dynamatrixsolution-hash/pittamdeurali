import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { getAPIImageUrl } from '../../services/api';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [capacityFilter, setCapacityFilter] = useState('');
  const [priceSort, setPriceSort] = useState('');

  useEffect(() => {
    const fetchRoomsAndSettings = async () => {
      try {
        const [roomsRes, settingsRes] = await Promise.all([
          api.get('/rooms'),
          api.get('/settings')
        ]);
        if (roomsRes.success) {
          setRooms(roomsRes.data);
        }
        if (settingsRes.success) {
          setSettings(settingsRes.data);
        }
      } catch (err) {
        console.error('Error loading rooms and settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoomsAndSettings();
  }, []);


  // Filter and sort logic
  let filteredRooms = [...rooms].filter(room => {
    if (!room.availability) return false;
    if (capacityFilter && room.capacity < Number(capacityFilter)) return false;
    return true;
  });

  if (priceSort === 'low-high') {
    filteredRooms.sort((a, b) => a.price - b.price);
  } else if (priceSort === 'high-low') {
    filteredRooms.sort((a, b) => b.price - a.price);
  }

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
            Rooms
          </h6>
          <h1 className="display-4 font-serif fw-bold my-2">Cozy Rooms & Lodging</h1>
          <div className="gold-accent-line"></div>
          <p className="lead text-secondary" style={{ fontSize: '1rem' }}>
            Comfortable double rooms, family cabins, and hiker accommodations designed for a warm, restful stay on your trekking journey.
          </p>
        </div>
      </div>

      {/* Filter and Sort bar */}
      <div className="row g-3 justify-content-between align-items-center mb-5 p-3 mx-1" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
        <div className="col-md-4 col-lg-3">
          <label className="form-label-luxury">Number of Guests</label>
          <select
            className="form-select form-luxury"
            value={capacityFilter}
            onChange={(e) => setCapacityFilter(e.target.value)}
          >
            <option value="">Any Capacity</option>
            <option value="1">1+ Guests</option>
            <option value="2">2+ Guests</option>
            <option value="3">3+ Guests</option>
            <option value="4">4+ Guests</option>
          </select>
        </div>
        <div className="col-md-4 col-lg-3">
          <label className="form-label-luxury">Sort By Price</label>
          <select
            className="form-select form-luxury"
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value)}
          >
            <option value="">Default Order</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="row g-4">
        {filteredRooms.map(room => (
          <div className="col-lg-4 col-md-6" key={room._id}>
            <div className="card-luxury h-100 d-flex flex-column">
              <div style={{ height: '240px', overflow: 'hidden', flexShrink: 0 }}>
                <img
                  src={getAPIImageUrl(room.images[0])}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                  alt={room.title}
                />
              </div>

              <div className="p-4 d-flex flex-column flex-grow-1">
                <div className="d-flex justify-content-between align-items-start gap-2 mb-3" style={{ minHeight: '56px' }}>
                  <h4 className="font-serif mb-0 fs-5 text-white" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{room.title}</h4>
                  {settings?.showRoomPricesPublicly ? (
                    <span className="fw-bold fs-6 text-nowrap" style={{ color: 'var(--color-gold)' }}>${room.price}</span>
                  ) : (
                    <span className="small text-gold fw-semibold text-nowrap">
                      {/* <a 
                        href={`https://wa.me/${settings?.whatsappNumber ? settings.whatsappNumber.replace(/[+\s-]/g, '') : '9779801234567'}?text=Hi,%20I'm%20interested%20in%20the%20price%20and%20booking%20of%20the%20${encodeURIComponent(room.title)}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none text-gold d-inline-flex align-items-center"
                        style={{ color: 'var(--color-gold)' }}
                        onClick={e => e.stopPropagation()}
                      >
                        Contact <i className="bi bi-whatsapp ms-1 text-success"></i>
                      </a> */}
                    </span>
                  )}
                </div>

                <div className="flex-grow-1 mb-3">
                  <p className="small text-secondary lh-lg mb-0" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {room.shortDescription}
                  </p>
                </div>

                <div className="d-flex flex-wrap gap-1 align-items-center" style={{ minHeight: '32px' }}>
                  {room.amenities.slice(0, 3).map((am, i) => (
                    <span className="badge rounded-0 bg-transparent text-secondary border px-2 py-1" style={{ fontSize: '0.7rem', borderColor: 'var(--border-color)' }} key={i}>
                      {am}
                    </span>
                  ))}
                  {room.amenities.length > 3 && <span className="text-secondary small ms-1" style={{ fontSize: '0.75rem' }}>+{room.amenities.length - 3} more</span>}
                </div>
              </div>

              <div className="px-4 pb-4 mt-auto">
                <div className="d-flex justify-content-between border-top border-bottom py-2 mb-4" style={{ borderColor: 'var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span><i className="bi bi-people me-1"></i> {room.capacity} Guests</span>
                  <span><i className="bi bi-calendar-check me-1"></i> {room.bedType}</span>
                  <span><i className="bi bi-arrows-fullscreen me-1"></i> {room.roomSize}</span>
                </div>
                <a
                  href={`https://wa.me/${settings?.whatsappNumber ? settings.whatsappNumber.replace(/[+\s-]/g, '') : '9779801234567'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success py-2.5 px-4 d-flex align-items-center gap-2 mb-2 justify-content-center"
                  style={{ border: 'none' }}
                >
                  <i className="bi bi-whatsapp"></i> Chat on WhatsApp
                </a>
                <Link to={`/rooms/${room.slug}`} className="btn btn-blue-outline w-100 py-2 text-center text-decoration-none">
                  Explore Room
                </Link>

              </div>
            </div>
          </div>
        ))}

        {filteredRooms.length === 0 && (
          <div className="col-12 text-center my-5">
            <h5 className="font-serif text-secondary">No accommodations match your selection.</h5>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;

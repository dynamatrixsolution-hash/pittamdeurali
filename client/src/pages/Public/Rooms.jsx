import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [capacityFilter, setCapacityFilter] = useState('');
  const [priceSort, setPriceSort] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get('/rooms');
        if (res.success) {
          setRooms(res.data);
        }
      } catch (err) {
        console.error('Error loading rooms:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const getAPIImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url}`;
  };

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
          <h1 className="display-4 font-serif fw-bold my-2 text-white">Luxury Accommodations</h1>
          <div className="gold-accent-line"></div>
          <p className="lead text-secondary" style={{ fontSize: '1rem' }}>
            Minimalist spaces crafted with local stone and wood, opening to private views of Pokhara's peaceful lakes.
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
            <div className="card-luxury h-100 d-flex flex-column justify-content-between">
              <div>
                <div style={{ height: '240px', overflow: 'hidden' }}>
                  <img 
                    src={getAPIImageUrl(room.images[0])} 
                    className="w-100 h-100" 
                    style={{ objectFit: 'cover' }} 
                    alt={room.title}
                  />
                </div>
                <div className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h4 className="font-serif mb-0 fs-5 text-white">{room.title}</h4>
                    <span className="fw-bold fs-6" style={{ color: 'var(--color-gold)' }}>${room.price}</span>
                  </div>
                  <p className="small text-secondary mb-3 lh-lg">{room.shortDescription}</p>
                  
                  <div className="d-flex flex-wrap gap-1 mb-3">
                    {room.amenities.slice(0, 3).map((am, i) => (
                      <span className="badge rounded-0 bg-transparent text-secondary border px-2 py-1" style={{ fontSize: '0.7rem', borderColor: 'var(--border-color)' }} key={i}>
                        {am}
                      </span>
                    ))}
                    {room.amenities.length > 3 && <span className="text-secondary small ms-1">+{room.amenities.length - 3} more</span>}
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="d-flex justify-content-between border-top border-bottom py-2 mb-4" style={{ borderColor: 'var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span><i className="bi bi-people me-1"></i> {room.capacity} Guests</span>
                  <span><i className="bi bi-calendar-check me-1"></i> {room.bedType}</span>
                  <span><i className="bi bi-arrows-fullscreen me-1"></i> {room.roomSize}</span>
                </div>
                <Link to={`/rooms/${room.slug}`} className="btn btn-luxury w-100 py-2 text-center text-decoration-none">
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

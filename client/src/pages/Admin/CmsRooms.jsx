import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const CmsRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); 
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [price, setPrice] = useState(150);
  const [capacity, setCapacity] = useState(2);
  const [bedType, setBedType] = useState('King');
  const [roomSize, setRoomSize] = useState('45 sqm');
  const [featured, setFeatured] = useState(false);
  const [availability, setAvailability] = useState(true);
  const [amenitiesText, setAmenitiesText] = useState('');
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const fetchRooms = async () => {
    try {
      const res = await api.get('/rooms');
      if (res.success) {
        setRooms(res.data);
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setShortDescription('');
    setPrice(150);
    setCapacity(2);
    setBedType('King');
    setRoomSize('45 sqm');
    setFeatured(false);
    setAvailability(true);
    setAmenitiesText('');
    setNewImages([]);
    setExistingImages([]);
    setSelectedRoomId(null);
  };

  const handleEditClick = (room) => {
    setSelectedRoomId(room._id);
    setTitle(room.title);
    setDescription(room.description);
    setShortDescription(room.shortDescription);
    setPrice(room.price);
    setCapacity(room.capacity);
    setBedType(room.bedType);
    setRoomSize(room.roomSize);
    setFeatured(room.featured);
    setAvailability(room.availability);
    setAmenitiesText(room.amenities.join(', '));
    setExistingImages(room.images);
    setNewImages([]);
    setView('edit');
  };

  const handleImageChange = (e) => {
    setNewImages(Array.from(e.target.files));
  };

  const handleRemoveExistingImage = (idxToRemove) => {
    setExistingImages(existingImages.filter((_, idx) => idx !== idxToRemove));
  };

  // --- Strict Form Validations ---
  const isTitleValid = title.length >= 5 && title.length <= 80;
  const isShortDescValid = shortDescription.length >= 15 && shortDescription.length <= 150;
  const isDescValid = description.length >= 80 && description.length <= 1200;

  const isFormValid = isTitleValid && isShortDescValid && isDescValid && price > 0 && capacity > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setMsg({ type: 'danger', text: 'Validation Error: Check character lengths.' });
      return;
    }

    setSaving(true);
    setMsg({ type: '', text: '' });

    const parsedAmenities = amenitiesText
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('shortDescription', shortDescription);
    formData.append('price', price);
    formData.append('capacity', capacity);
    formData.append('bedType', bedType);
    formData.append('roomSize', roomSize);
    formData.append('featured', featured);
    formData.append('availability', availability);
    formData.append('amenities', JSON.stringify(parsedAmenities));

    if (view === 'edit') {
      formData.append('existingImages', JSON.stringify(existingImages));
    }

    newImages.forEach(file => {
      formData.append('images', file);
    });

    try {
      let res;
      if (view === 'add') {
        res = await api.post('/rooms', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await api.put(`/rooms/${selectedRoomId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (res.success) {
        setMsg({ type: 'success', text: `Room ${view === 'add' ? 'created' : 'updated'} successfully!` });
        resetForm();
        setView('list');
        fetchRooms();
      }
    } catch (err) {
      setMsg({ type: 'danger', text: typeof err === 'string' ? err : 'Error saving room details.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    setMsg({ type: '', text: '' });

    try {
      const res = await api.delete(`/rooms/${id}`);
      if (res.success) {
        setMsg({ type: 'success', text: 'Room deleted successfully.' });
        fetchRooms();
      }
    } catch (err) {
      setMsg({ type: 'danger', text: typeof err === 'string' ? err : 'Delete failed.' });
    }
  };

  if (loading) {
    return <div className="text-center p-5 text-secondary"><div className="spinner-border spinner-luxury" /></div>;
  }

  return (
    <div className="fade-in-up">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="font-serif fw-bold m-0 text-white">Rooms CMS Manager</h3>
        {view === 'list' ? (
          <button className="btn btn-luxury py-2" onClick={() => { resetForm(); setView('add'); }}>
            <i className="bi bi-plus-lg me-2"></i> Add Luxury Room
          </button>
        ) : (
          <button className="btn btn-luxury-outline py-2" onClick={() => { resetForm(); setView('list'); }}>
            Cancel
          </button>
        )}
      </div>

      {msg.text && <div className={`alert alert-${msg.type} rounded-0 py-2 mb-4`}>{msg.text}</div>}

      {view === 'list' ? (
        <div className="table-luxury">
          <table className="table table-dark table-hover mb-0 align-middle small" style={{ borderColor: 'var(--border-color)' }}>
            <thead>
              <tr className="text-uppercase" style={{ fontSize: '0.75rem', color: 'var(--color-gold)' }}>
                <th className="py-3 px-4">Title</th>
                <th className="py-3">Specs</th>
                <th className="py-3">Price</th>
                <th className="py-3">Availability</th>
                <th className="py-3">Featured</th>
                <th className="py-3 px-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(room => (
                <tr key={room._id}>
                  <td className="py-3 px-4 fw-bold text-white">{room.title}</td>
                  <td>{room.roomSize} &bull; {room.bedType} &bull; Capacity {room.capacity}</td>
                  <td className="fw-semibold" style={{ color: 'var(--color-gold)' }}>${room.price}/night</td>
                  <td>
                    <span className={`badge rounded-0 ${room.availability ? 'bg-success' : 'bg-danger'}`}>
                      {room.availability ? 'Available' : 'Booked'}
                    </span>
                  </td>
                  <td>{room.featured ? 'Yes' : 'No'}</td>
                  <td className="py-3 px-4 text-end">
                    <button className="btn btn-sm btn-luxury-outline me-2 py-1 px-2 border-0" onClick={() => handleEditClick(room)}>
                      <i className="bi bi-pencil-square"></i> Edit
                    </button>
                    <button className="btn btn-sm btn-outline-danger py-1 px-2 border-0" onClick={() => handleDelete(room._id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {rooms.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-secondary">No rooms created yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        // Add or Edit Form
        <form onSubmit={handleSubmit} className="p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
          <h5 className="font-serif fw-bold text-white mb-4 border-bottom pb-2" style={{ borderColor: 'var(--border-color)', color: 'var(--color-gold) !important' }}>
            {view === 'add' ? 'New Sanctuary Room' : 'Modify Room Details'}
          </h5>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label-luxury">Room Title *</label>
              <input type="text" className="form-control form-luxury" value={title} onChange={e => setTitle(e.target.value)} required />
              <div className={`char-counter ${!isTitleValid ? 'error' : ''}`}>
                {title.length} / 80 characters (min 5)
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label-luxury">Price Per Night ($) *</label>
              <input type="number" className="form-control form-luxury" value={price} onChange={e => setPrice(Number(e.target.value))} required />
            </div>

            <div className="col-md-4">
              <label className="form-label-luxury">Bed Type *</label>
              <input type="text" className="form-control form-luxury" value={bedType} onChange={e => setBedType(e.target.value)} placeholder="e.g. King, Double" required />
            </div>
            <div className="col-md-4">
              <label className="form-label-luxury">Room Sizing (sqm) *</label>
              <input type="text" className="form-control form-luxury" value={roomSize} onChange={e => setRoomSize(e.target.value)} placeholder="e.g. 50 sqm" required />
            </div>
            <div className="col-md-4">
              <label className="form-label-luxury">Guest Capacity *</label>
              <input type="number" className="form-control form-luxury" value={capacity} onChange={e => setCapacity(Number(e.target.value))} required />
            </div>

            <div className="col-12">
              <label className="form-label-luxury">Short Card Description *</label>
              <input type="text" className="form-control form-luxury" value={shortDescription} onChange={e => setShortDescription(e.target.value)} required />
              <div className={`char-counter ${!isShortDescValid ? 'error' : ''}`}>
                {shortDescription.length} / 150 characters (min 15)
              </div>
            </div>

            <div className="col-12">
              <label className="form-label-luxury">Full Room Overview Description *</label>
              <textarea className="form-control form-luxury" rows="4" value={description} onChange={e => setDescription(e.target.value)} required></textarea>
              <div className={`char-counter ${!isDescValid ? 'error' : ''}`}>
                {description.length} / 1200 characters (min 80)
              </div>
            </div>

            <div className="col-12">
              <label className="form-label-luxury">Amenities (comma separated list)</label>
              <input type="text" className="form-control form-luxury" value={amenitiesText} onChange={e => setAmenitiesText(e.target.value)} placeholder="e.g. Butler, Hot Tub, Mini Bar, Wi-Fi" />
            </div>
          </div>

          {/* Image Upload section */}
          <div className="mb-4 border-top pt-4" style={{ borderColor: 'var(--border-color)' }}>
            <label className="form-label-luxury">Upload New Gallery Images (Multi)</label>
            <input type="file" className="form-control form-luxury mb-3" multiple accept="image/*" onChange={handleImageChange} />

            {view === 'edit' && existingImages.length > 0 && (
              <div>
                <label className="form-label-luxury d-block">Existing Images</label>
                <div className="d-flex flex-wrap gap-2">
                  {existingImages.map((img, idx) => (
                    <div key={idx} className="position-relative" style={{ width: '80px', height: '80px', border: '1px solid var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                      <img src={img.startsWith('http') ? img : `http://localhost:5000${img}`} alt="" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                      <button type="button" className="btn btn-sm btn-danger position-absolute top-0 end-0 py-0 px-1 rounded-0" style={{ fontSize: '0.65rem' }} onClick={() => handleRemoveExistingImage(idx)}>
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Visibility Controls */}
          <div className="d-flex gap-4 mb-4 border-top pt-4" style={{ borderColor: 'var(--border-color)' }}>
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" role="switch" id="featuredSwitch" checked={featured} onChange={e => setFeatured(e.target.checked)} />
              <label className="form-check-label text-white small" htmlFor="featuredSwitch">Featured Room (Shows on Homepage)</label>
            </div>
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" role="switch" id="availSwitch" checked={availability} onChange={e => setAvailability(e.target.checked)} />
              <label className="form-check-label text-white small" htmlFor="availSwitch">Publish / Set Room Available</label>
            </div>
          </div>

          <button type="submit" className="btn btn-luxury px-5 py-3" disabled={saving || !isFormValid}>
            {saving ? 'Saving...' : 'Save Sanctuary Room'}
          </button>
        </form>
      )}
    </div>
  );
};

export default CmsRooms;

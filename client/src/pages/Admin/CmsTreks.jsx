import React, { useState, useEffect } from 'react';
import api, { getAPIImageUrl } from '../../services/api';

const CmsTreks = () => {
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Form Fields
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState('Moderate');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const fetchTreks = async () => {
    try {
      const res = await api.get('/treks');
      if (res.success) {
        setTreks(res.data);
      }
    } catch (err) {
      console.error('Error fetching treks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreks();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const isFormValid = name.length >= 3 && duration.length >= 2 && description.length >= 10;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setMsg({ type: 'danger', text: 'Validation: Name min 3 chars, duration min 2, description min 10.' });
      return;
    }

    setMsg({ type: '', text: '' });
    setSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('difficulty', difficulty);
    formData.append('duration', duration);
    formData.append('description', description);
    if (file) {
      formData.append('image', file);
    }

    try {
      let res;
      if (editingId) {
        res = await api.put(`/treks/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        if (!file) {
          setMsg({ type: 'danger', text: 'Please upload an image for the trek route.' });
          setSubmitting(false);
          return;
        }
        res = await api.post('/treks', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (res.success) {
        setMsg({ type: 'success', text: editingId ? 'Trek route updated successfully!' : 'Trek route added successfully!' });
        resetForm();
        fetchTreks();
      }
    } catch (err) {
      setMsg({ type: 'danger', text: typeof err === 'string' ? err : 'Submission failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (trek) => {
    setEditingId(trek._id);
    setName(trek.name);
    setDifficulty(trek.difficulty);
    setDuration(trek.duration);
    setDescription(trek.description);
    setFile(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trek route?')) return;
    setMsg({ type: '', text: '' });

    try {
      const res = await api.delete(`/treks/${id}`);
      if (res.success) {
        setMsg({ type: 'success', text: 'Trek route deleted.' });
        fetchTreks();
      }
    } catch (err) {
      setMsg({ type: 'danger', text: typeof err === 'string' ? err : 'Delete failed.' });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDifficulty('Moderate');
    setDuration('');
    setDescription('');
    setFile(null);
    const fileInput = document.getElementById('trekFile');
    if (fileInput) fileInput.value = '';
  };


  if (loading) {
    return <div className="text-center p-5 text-secondary"><div className="spinner-border spinner-luxury" /></div>;
  }

  return (
    <div className="fade-in-up">
      <h3 className="font-serif fw-bold mb-4 text-white">Popular Treks CMS Manager</h3>

      {msg.text && <div className={`alert alert-${msg.type} rounded-0 py-2 mb-4`}>{msg.text}</div>}

      <div className="row g-4">
        {/* Form Block */}
        <div className="col-lg-4">
          <form onSubmit={handleSubmit} className="p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
            <h5 className="font-serif fw-bold text-white mb-3" style={{ color: 'var(--color-gold) !important' }}>
              {editingId ? 'Edit Trek Route' : 'Add Trek Route'}
            </h5>

            <div className="mb-3">
              <label className="form-label-luxury">Trek Name *</label>
              <input type="text" className="form-control form-luxury" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Mardi Himal Trek" required />
            </div>

            <div className="mb-3">
              <label className="form-label-luxury">Difficulty Level *</label>
              <select className="form-select form-luxury" value={difficulty} onChange={e => setDifficulty(e.target.value)} required>
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Hard">Hard</option>
                <option value="Challenging">Challenging</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label-luxury">Duration *</label>
              <input type="text" className="form-control form-luxury" value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 5-6 Days" required />
            </div>

            <div className="mb-3">
              <label className="form-label-luxury">Image File {editingId ? '(Optional)' : '*'}</label>
              <input type="file" id="trekFile" className="form-control form-luxury" onChange={handleFileChange} accept="image/*" required={!editingId} />
              {file && (
                <div className="mt-2" style={{ maxWidth: '100%', maxHeight: '180px', overflow: 'hidden', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                  <img src={URL.createObjectURL(file)} alt="Upload Preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="form-label-luxury">Description *</label>
              <textarea className="form-control form-luxury" rows="4" value={description} onChange={e => setDescription(e.target.value)} placeholder="Provide trail checkpoints, elevation details..." required></textarea>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-luxury w-100 py-3" disabled={submitting || !isFormValid}>
                {submitting ? 'Submitting...' : editingId ? 'Update' : 'Add Trek'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-luxury-outline w-100 py-3" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Block */}
        <div className="col-lg-8">
          <div className="p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
            <h5 className="font-serif fw-bold text-white mb-4">Active Trekking Routes</h5>

            <div className="table-responsive table-luxury">
              <table className="table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Difficulty</th>
                    <th>Duration</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {treks.map(trek => (
                    <tr key={trek._id}>
                      <td>
                        <div style={{ width: '60px', height: '60px', overflow: 'hidden', borderRadius: '4px' }}>
                          <img src={getAPIImageUrl(trek.image)} alt="" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                        </div>
                      </td>
                      <td className="fw-bold">{trek.name}</td>
                      <td>{trek.difficulty}</td>
                      <td>{trek.duration}</td>
                      <td style={{ maxWidth: '200px' }} className="text-truncate">{trek.description}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-luxury-outline py-1 px-2" onClick={() => handleEditClick(trek)}>
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger py-1 px-2 rounded-0" onClick={() => handleDelete(trek._id)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {treks.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-secondary">
                        No trek routes found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CmsTreks;

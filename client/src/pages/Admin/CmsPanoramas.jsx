import React, { useState, useEffect } from 'react';
import api, { getAPIImageUrl } from '../../services/api';

const CmsPanoramas = () => {
  const [panoramas, setPanoramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Upload Form Fields
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [order, setOrder] = useState('0');

  // Replace Fields
  const [editingId, setEditingId] = useState(null);
  const [replaceFile, setReplaceFile] = useState(null);
  const [editCaption, setEditCaption] = useState('');
  const [editOrder, setEditOrder] = useState('0');

  const fetchPanoramas = async () => {
    try {
      const res = await api.get('/gallery?category=360 View');
      if (res.success) {
        setPanoramas(res.data);
      }
    } catch (err) {
      console.error('Error fetching panoramas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPanoramas();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleReplaceFileChange = (e) => {
    setReplaceFile(e.target.files[0]);
  };

  const isFormValid = file !== null && (caption.length === 0 || (caption.length >= 2 && caption.length <= 100));

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setMsg({ type: 'danger', text: 'Validation: Caption must be 2-100 characters.' });
      return;
    }

    setMsg({ type: '', text: '' });
    setUploading(true);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', '360 View');
    formData.append('caption', caption);
    formData.append('order', order);

    try {
      const res = await api.post('/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.success) {
        setMsg({ type: 'success', text: '360° Panorama uploaded successfully!' });
        setFile(null);
        setCaption('');
        setOrder('0');
        document.getElementById('panoFile').value = '';
        fetchPanoramas();
      }
    } catch (err) {
      setMsg({ type: 'danger', text: typeof err === 'string' ? err : 'Upload failed.' });
    } finally {
      setUploading(false);
    }
  };

  const handleEditClick = (pano) => {
    setEditingId(pano._id);
    setEditCaption(pano.caption || '');
    setEditOrder(pano.order ? String(pano.order) : '0');
    setReplaceFile(null);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    setUploading(true);

    const formData = new FormData();
    formData.append('caption', editCaption);
    formData.append('order', editOrder);
    if (replaceFile) {
      formData.append('image', replaceFile);
    }

    try {
      const res = await api.put(`/gallery/${editingId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.success) {
        setMsg({ type: 'success', text: 'Panorama updated successfully!' });
        setEditingId(null);
        setReplaceFile(null);
        fetchPanoramas();
      }
    } catch (err) {
      setMsg({ type: 'danger', text: typeof err === 'string' ? err : 'Update failed.' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this 360° panorama?')) return;
    setMsg({ type: '', text: '' });

    try {
      const res = await api.delete(`/gallery/${id}`);
      if (res.success) {
        setMsg({ type: 'success', text: 'Panorama deleted.' });
        fetchPanoramas();
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
      <h3 className="font-serif fw-bold mb-4 text-white">360° Virtual Tour CMS Manager</h3>

      {msg.text && <div className={`alert alert-${msg.type} rounded-0 py-2 mb-4`}>{msg.text}</div>}

      <div className="row g-4">
        {/* Upload/Edit Form Block */}
        <div className="col-lg-4">
          {editingId ? (
            <form onSubmit={handleUpdateSubmit} className="p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
              <h5 className="font-serif fw-bold text-white mb-3" style={{ color: 'var(--color-gold) !important' }}>Replace/Edit Panorama</h5>

              <div className="mb-3">
                <label className="form-label-luxury">Replace Image File (Optional)</label>
                <input type="file" className="form-control form-luxury" onChange={handleReplaceFileChange} accept="image/*" />
                <div className="small text-secondary mt-1">Leave empty to keep current panorama image.</div>
                {replaceFile && (
                  <div className="mt-2" style={{ maxWidth: '100%', maxHeight: '180px', overflow: 'hidden', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                    <img src={URL.createObjectURL(replaceFile)} alt="Replace Preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label-luxury">Caption / Location Name</label>
                <input type="text" className="form-control form-luxury" value={editCaption} onChange={e => setEditCaption(e.target.value)} required />
              </div>

              <div className="mb-4">
                <label className="form-label-luxury">Sorting Order</label>
                <input type="number" className="form-control form-luxury" value={editOrder} onChange={e => setEditOrder(e.target.value)} required />
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-luxury w-100 py-2.5" disabled={uploading}>
                  {uploading ? 'Updating...' : 'Save Changes'}
                </button>
                <button type="button" className="btn btn-luxury-outline w-100 py-2.5" onClick={() => setEditingId(null)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleUploadSubmit} className="p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
              <h5 className="font-serif fw-bold text-white mb-3" style={{ color: 'var(--color-gold) !important' }}>Upload Panorama</h5>

              <div className="mb-3">
                <label className="form-label-luxury">Select Panorama Image *</label>
                <input type="file" id="panoFile" className="form-control form-luxury" onChange={handleFileChange} accept="image/*" required />
                <div className="small text-secondary mt-1">Requires an equirectangular 360° image file.</div>
                {file && (
                  <div className="mt-2" style={{ maxWidth: '100%', maxHeight: '180px', overflow: 'hidden', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                    <img src={URL.createObjectURL(file)} alt="Upload Preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label-luxury">Caption / Location Name *</label>
                <input type="text" className="form-control form-luxury" value={caption} onChange={e => setCaption(e.target.value)} placeholder="e.g. Guest House Dining Hall" required />
              </div>

              <div className="mb-4">
                <label className="form-label-luxury">Sorting Order</label>
                <input type="number" className="form-control form-luxury" value={order} onChange={e => setOrder(e.target.value)} />
              </div>

              <button type="submit" className="btn btn-luxury w-100 py-3" disabled={uploading || !isFormValid}>
                {uploading ? 'Uploading Panorama...' : 'Upload 360° Asset'}
              </button>
            </form>
          )}
        </div>

        {/* Panoramas List Block */}
        <div className="col-lg-8">
          <div className="p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
            <h5 className="font-serif fw-bold text-white mb-4">Panorama Library (360° Views)</h5>

            <div className="row g-3">
              {panoramas.map(pano => (
                <div className="col-md-6" key={pano._id}>
                  <div className="card-luxury p-2 h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div style={{ height: '140px', border: '1px solid var(--border-color)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                        <img src={getAPIImageUrl(pano.url)} alt="" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                        <span className="badge bg-dark position-absolute top-2 start-2 small opacity-90">Order: {pano.order}</span>
                      </div>
                      <h6 className="font-serif text-white mt-2 mb-1 px-1">{pano.caption || 'No Caption'}</h6>
                    </div>
                    <div className="d-flex gap-2 mt-3 px-1 pb-1">
                      <button type="button" className="btn btn-sm btn-luxury-outline w-100 py-1.5" onClick={() => handleEditClick(pano)}>
                        <i className="bi bi-pencil me-1"></i> Edit/Replace
                      </button>
                      <button type="button" className="btn btn-sm btn-outline-danger w-50 py-1.5 rounded-0" onClick={() => handleDelete(pano._id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {panoramas.length === 0 && (
                <div className="col-12 text-center py-5 text-secondary">
                  No 360° panoramas found. Upload one to start the Virtual Tour.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CmsPanoramas;

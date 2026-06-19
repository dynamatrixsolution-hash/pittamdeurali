import React, { useState, useEffect } from 'react';
import api, { getAPIImageUrl } from '../../services/api';

const CmsReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All'); // 'All', 'Pending', 'Approved', 'Rejected'
  const [msg, setMsg] = useState({ type: '', text: '' });

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reviews');
      if (res.success) {
        setReviews(res.data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setMsg({ type: 'danger', text: 'Error loading reviews from database.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setMsg({ type: '', text: '' });
    try {
      const res = await api.put(`/reviews/${id}/status`, { status: newStatus });
      if (res.success) {
        setMsg({ type: 'success', text: `Review status updated to ${newStatus} successfully.` });
        fetchReviews();
      }
    } catch (err) {
      setMsg({ type: 'danger', text: typeof err === 'string' ? err : 'Error updating review status.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review permanently? This will also remove any uploaded guest photos.')) return;
    setMsg({ type: '', text: '' });
    try {
      const res = await api.delete(`/reviews/${id}`);
      if (res.success) {
        setMsg({ type: 'success', text: 'Review deleted successfully.' });
        fetchReviews();
      }
    } catch (err) {
      setMsg({ type: 'danger', text: typeof err === 'string' ? err : 'Error deleting review.' });
    }
  };


  const filteredReviews = reviews.filter(item => {
    if (filterStatus === 'All') return true;
    return item.status === filterStatus;
  });

  if (loading && reviews.length === 0) {
    return <div className="text-center p-5 text-secondary"><div className="spinner-border spinner-luxury" /></div>;
  }

  return (
    <div className="fade-in-up text-white">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h3 className="font-serif fw-bold m-0">Review Moderation Console</h3>
          <p className="text-secondary small m-0">Approve, reject, or purge traveler reviews submitted on the public website.</p>
        </div>
        
        {/* Status Filters */}
        <div className="d-flex gap-2 mt-3 mt-md-0">
          {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`btn btn-sm px-3 py-2 border-0 rounded-0 text-uppercase small ${filterStatus === status ? 'btn-luxury' : 'btn-luxury-outline'}`}
              style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}
            >
              {status === 'All' ? 'All Reviews' : `${status}`}
            </button>
          ))}
        </div>
      </div>

      {msg.text && <div className={`alert alert-${msg.type} rounded-0 py-2 mb-4`}>{msg.text}</div>}

      <div className="table-luxury">
        <table className="table table-dark mb-0 align-middle small" style={{ borderColor: 'var(--border-color)' }}>
          <thead>
            <tr className="text-uppercase" style={{ fontSize: '0.75rem', color: 'var(--color-gold)' }}>
              <th className="py-3 px-4" style={{ width: '220px' }}>Guest Name</th>
              <th className="py-3">Country</th>
              <th className="py-3">Rating</th>
              <th className="py-3">Review Message</th>
              <th className="py-3">Status</th>
              <th className="py-3">Submitted</th>
              <th className="py-3 px-4 text-end" style={{ width: '240px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map(item => (
              <tr key={item._id}>
                <td className="py-3 px-4 fw-bold text-white">
                  <div className="d-flex align-items-center gap-2">
                    <img 
                      src={getAPIImageUrl(item.image) || 'https://img.icons8.com/office/40/user.png'} 
                      alt="" 
                      style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%', border: '1px solid var(--border-color)' }}
                    />
                    <span>{item.guestName}</span>
                  </div>
                </td>
                <td>{item.country || <span className="text-muted italic">Not specified</span>}</td>
                <td style={{ color: 'var(--color-gold)' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <i 
                      className={`bi bi-star-fill me-1 ${i < item.rating ? 'text-gold' : 'text-secondary'}`} 
                      key={i} 
                      style={{ fontSize: '0.75rem', opacity: i < item.rating ? 1 : 0.25 }}
                    ></i>
                  ))}
                </td>
                <td className="text-secondary" style={{ maxWidth: '300px', whiteSpace: 'normal', lineHeight: '1.4' }}>
                  "{item.review}"
                </td>
                <td>
                  <span className={`badge rounded-0 text-uppercase ${
                    item.status === 'Approved' ? 'bg-success' : 
                    item.status === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark'
                  }`} style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                    {item.status}
                  </span>
                </td>
                <td className="text-secondary">{new Date(item.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-4 text-end">
                  {item.status !== 'Approved' && (
                    <button 
                      className="btn btn-sm btn-success me-2 py-1 px-2 border-0" 
                      onClick={() => handleStatusChange(item._id, 'Approved')}
                    >
                      Approve
                    </button>
                  )}
                  {item.status !== 'Rejected' && (
                    <button 
                      className="btn btn-sm btn-outline-warning me-2 py-1 px-2 border-0" 
                      onClick={() => handleStatusChange(item._id, 'Rejected')}
                    >
                      Reject
                    </button>
                  )}
                  <button className="btn btn-sm btn-outline-danger py-1 px-2 border-0" onClick={() => handleDelete(item._id)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
            {filteredReviews.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-5 text-secondary">
                  No guest reviews found matching current filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CmsReviews;

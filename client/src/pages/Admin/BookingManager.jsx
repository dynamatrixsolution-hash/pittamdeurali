import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const BookingManager = () => {
  const ITEMS_PER_PAGE = 10;
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings'); 
  const [bookingsPage, setBookingsPage] = useState(1);
  const [inquiriesPage, setInquiriesPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const fetchData = async () => {
    try {
      const [bookingsRes, inquiriesRes] = await Promise.all([
        api.get('/bookings'),
        api.get('/inquiries')
      ]);

      if (bookingsRes.success) setBookings(bookingsRes.data);
      if (inquiriesRes.success) setInquiries(inquiriesRes.data);
    } catch (err) {
      console.error('Error fetching bookings/inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getSortTime = (item) => {
    const fallback = 0;
    const timeSource = item?.createdAt || item?.updatedAt || item?.checkIn || item?.date;
    const parsed = Date.parse(timeSource);
    return Number.isNaN(parsed) ? fallback : parsed;
  };

  const sortedBookings = [...bookings].sort((a, b) => getSortTime(b) - getSortTime(a));
  const sortedInquiries = [...inquiries].sort((a, b) => getSortTime(b) - getSortTime(a));

  const totalBookingPages = Math.max(1, Math.ceil(sortedBookings.length / ITEMS_PER_PAGE));
  const totalInquiryPages = Math.max(1, Math.ceil(sortedInquiries.length / ITEMS_PER_PAGE));

  const paginatedBookings = sortedBookings.slice((bookingsPage - 1) * ITEMS_PER_PAGE, bookingsPage * ITEMS_PER_PAGE);
  const paginatedInquiries = sortedInquiries.slice((inquiriesPage - 1) * ITEMS_PER_PAGE, inquiriesPage * ITEMS_PER_PAGE);

  const renderPagination = (currentPage, totalPages, onPageChange) => {
    if (totalPages <= 1) return null;

    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) pages.push(i);

    return (
      <nav className="mt-4 d-flex justify-content-center" aria-label="Admin list pagination">
        <ul className="pagination mb-0">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link admin-page-link" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
              Prev
            </button>
          </li>
          {pages.map(page => (
            <li className={`page-item ${currentPage === page ? 'active' : ''}`} key={page}>
              <button className="page-link admin-page-link" onClick={() => onPageChange(page)}>
                {page}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link admin-page-link" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  const handleBookingStatusChange = async (id, status) => {
    setMsg({ type: '', text: '' });
    try {
      const res = await api.put(`/bookings/${id}`, { status });
      if (res.success) {
        setMsg({ type: 'success', text: `Reservation status updated to ${status}` });
        fetchData();
      }
    } catch (err) {
      setMsg({ type: 'danger', text: typeof err === 'string' ? err : 'Failed to update status.' });
    }
  };

  const handleInquiryStatusChange = async (id, status) => {
    setMsg({ type: '', text: '' });
    try {
      const res = await api.put(`/inquiries/${id}`, { status });
      if (res.success) {
        setMsg({ type: 'success', text: `Inquiry marked as ${status}` });
        fetchData();
      }
    } catch (err) {
      setMsg({ type: 'danger', text: typeof err === 'string' ? err : 'Failed to update inquiry.' });
    }
  };

  const handleBookingDelete = async (id) => {
    if (!window.confirm('Delete this reservation record?')) return;
    setMsg({ type: '', text: '' });
    try {
      const res = await api.delete(`/bookings/${id}`);
      if (res.success) {
        setMsg({ type: 'success', text: 'Reservation record deleted.' });
        fetchData();
      }
    } catch (err) {
      setMsg({ type: 'danger', text: typeof err === 'string' ? err : 'Delete failed.' });
    }
  };

  const handleInquiryDelete = async (id) => {
    if (!window.confirm('Delete this inquiry record?')) return;
    setMsg({ type: '', text: '' });
    try {
      const res = await api.delete(`/inquiries/${id}`);
      if (res.success) {
        setMsg({ type: 'success', text: 'Inquiry record deleted.' });
        fetchData();
      }
    } catch (err) {
      setMsg({ type: 'danger', text: typeof err === 'string' ? err : 'Delete failed.' });
    }
  };

  if (loading) {
    return <div className="text-center p-5 text-secondary"><div className="spinner-border spinner-luxury" /></div>;
  }

  // Common Empty State Sub-Component
  const EmptyState = ({ message, icon = 'bi-inbox' }) => (
    <div className="empty-state-card card-luxury">
      <div className="empty-state-icon">
        <i className={`bi ${icon}`}></i>
      </div>
      <h5 className="font-serif fw-bold mb-2">No Records Found</h5>
      <p className="small text-secondary mb-0">{message}</p>
    </div>
  );

  return (
    <div className="fade-in-up">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="font-serif fw-bold m-0">Reservations & Inquiries</h3>
        <div className="d-flex gap-2">
          <button 
            className={`btn btn-sm px-4 py-2 border-0 rounded-0 text-uppercase small ${activeTab === 'bookings' ? 'btn-luxury' : 'btn-luxury-outline'}`}
            onClick={() => {
              setActiveTab('bookings');
              setBookingsPage(1);
            }}
            style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
          >
            Room Bookings ({bookings.length})
          </button>
          <button 
            className={`btn btn-sm px-4 py-2 border-0 rounded-0 text-uppercase small ${activeTab === 'inquiries' ? 'btn-luxury' : 'btn-luxury-outline'}`}
            onClick={() => {
              setActiveTab('inquiries');
              setInquiriesPage(1);
            }}
            style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
          >
            Inquiries ({inquiries.length})
          </button>
        </div>
      </div>

      {msg.text && <div className={`alert alert-${msg.type} rounded-0 py-2 mb-4`}>{msg.text}</div>}

      {activeTab === 'bookings' ? (
        // Room Bookings
        sortedBookings.length > 0 ? (
          <div className="d-flex flex-column gap-3">
            {paginatedBookings.map(b => (
              <div key={b._id} className="p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                <div className="d-flex justify-content-between align-items-start mb-3 border-bottom pb-3 flex-wrap gap-3" style={{ borderColor: 'var(--border-color)' }}>
                  <div>
                    <h5 className="font-serif fw-bold mb-1">{b.guestName}</h5>
                    <span className="small text-muted">
                      Booking ID: {b.bookingId} &bull; {b.guestEmail} &bull; {b.guestPhone}
                    </span>
                  </div>
                  <div className="d-flex gap-2 align-items-center">
                    <select
                      className="form-select form-select-sm admin-select"
                      value={b.status}
                      onChange={e => handleBookingStatusChange(b._id, e.target.value)}
                      style={{ width: '140px' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="CheckedIn">Checked In</option>
                      <option value="CheckedOut">Checked Out</option>
                    </select>
                    <button className="btn btn-sm btn-outline-danger py-1 px-2 rounded-0 border-0" onClick={() => handleBookingDelete(b._id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>

                <div className="row g-3 small">
                  <div className="col-md-4">
                    <div className="text-secondary text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>Room</div>
                    <div className="fw-semibold">{b.room?.title || 'Chamber details missing'}</div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-secondary text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>Stay Dates</div>
                    <div>{new Date(b.checkIn).toLocaleDateString()} to {new Date(b.checkOut).toLocaleDateString()}</div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-secondary text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>Total Cost</div>
                    <div className="fw-bold" style={{ color: 'var(--color-gold)' }}>${b.totalPrice}</div>
                  </div>
                </div>
              </div>
            ))}
            {renderPagination(bookingsPage, totalBookingPages, setBookingsPage)}
          </div>
        ) : (
          <EmptyState message="There are currently no active room bookings recorded on this retreat." />
        )
      ) : (
        // Inquiries / Messages
        sortedInquiries.length > 0 ? (
          <div className="d-flex flex-column gap-3">
            {paginatedInquiries.map(inq => (
              <div key={inq._id} className="p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                <div className="d-flex justify-content-between align-items-start mb-3 border-bottom pb-3" style={{ borderColor: 'var(--border-color)' }}>
                  <div>
                    <h5 className="font-serif fw-bold mb-1">{inq.name}</h5>
                    <span className="small text-muted">{inq.email} &bull; {inq.phone}</span>
                  </div>
                  <div className="d-flex gap-2">
                    <select 
                      className="form-select form-select-sm admin-select"
                      value={inq.status}
                      onChange={e => handleInquiryStatusChange(inq._id, e.target.value)}
                      style={{ width: '120px' }}
                    >
                      <option value="Unread">Unread</option>
                      <option value="Read">Read</option>
                      <option value="Archived">Archived</option>
                    </select>
                    <button className="btn btn-sm btn-outline-danger py-1 px-2 rounded-0 border-0" onClick={() => handleInquiryDelete(inq._id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
                <div className="small text-secondary mb-3 lh-lg" style={{ whiteSpace: 'pre-line', textAlign: 'justify' }}>
                  {inq.message}
                </div>
                {inq.checkIn && (
                  <div className="small text-muted border-top pt-2 d-flex gap-4" style={{ borderColor: 'var(--border-color)' }}>
                    <span><i className="bi bi-calendar-check me-1"></i> Check-in: {new Date(inq.checkIn).toLocaleDateString()}</span>
                    <span><i className="bi bi-calendar-x me-1"></i> Check-out: {new Date(inq.checkOut).toLocaleDateString()}</span>
                    <span><i className="bi bi-people me-1"></i> Guests: {inq.guestsCount}</span>
                  </div>
                )}
              </div>
            ))}
            {renderPagination(inquiriesPage, totalInquiryPages, setInquiriesPage)}
          </div>
        ) : (
          <EmptyState message="There are no contact form inquiries or messages left by guests." icon="bi-chat-left" />
        )
      )}
    </div>
  );
};

export default BookingManager;

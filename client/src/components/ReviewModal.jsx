import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import api from '../services/api';

const ReviewModal = ({ isOpen, onClose }) => {
  const [reviewForm, setReviewForm] = useState({ guestName: '', country: '', rating: 5, review: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  if (!isOpen) {
    if (isSubmittedSuccess) setIsSubmittedSuccess(false); // reset when closed externally
    return null;
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    setReviewMessage('');
    try {
      const res = await api.post('/reviews', reviewForm);
      if (res.success) {
        setReviewForm({ guestName: '', country: '', rating: 5, review: '' });
        setIsSubmittedSuccess(true);
        setTimeout(() => {
          onClose();
          setIsSubmittedSuccess(false);
          setReviewMessage('');
        }, 3000);
      } else {
        setReviewMessage(res.message || 'Failed to submit review.');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setReviewMessage('An error occurred while submitting the review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return createPortal(
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060 }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
        <div className="modal-content" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
          <div className="modal-header border-0 pb-0 d-flex justify-content-between align-items-center">
            <h5 className="modal-title font-serif fw-bold" style={{ color: 'var(--text-primary)' }}>Leave a Review</h5>
            <button type="button" className="btn btn-sm border-0 bg-transparent" onClick={onClose}>
              <i className="bi bi-x-lg fs-5" style={{ color: 'var(--text-primary)' }}></i>
            </button>
          </div>
          <div className="modal-body">
            {isSubmittedSuccess ? (
              <div className="text-center py-5">
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
                <h4 className="font-serif fw-bold mt-4" style={{ color: 'var(--text-primary)' }}>Thank You!</h4>
                <p className="text-secondary mt-2">Your review has been submitted successfully and will appear after approval.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-3">
                  <label className="form-label small text-secondary">Your Name</label>
                  <input type="text" className="form-control" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} required value={reviewForm.guestName} onChange={(e) => setReviewForm({...reviewForm, guestName: e.target.value})} />
                </div>
                <div className="mb-3">
                  <label className="form-label small text-secondary">Country</label>
                  <select 
                    className="form-select" 
                    style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} 
                    required 
                    value={reviewForm.country} 
                    onChange={(e) => setReviewForm({...reviewForm, country: e.target.value})}
                  >
                    <option value="">Select your country</option>
                    {[
                      { name: 'Nepal', flag: '🇳🇵' },
                      { name: 'India', flag: '🇮🇳' },
                      { name: 'United States', flag: '🇺🇸' },
                      { name: 'United Kingdom', flag: '🇬🇧' },
                      { name: 'Australia', flag: '🇦🇺' },
                      { name: 'Canada', flag: '🇨🇦' },
                      { name: 'Germany', flag: '🇩🇪' },
                      { name: 'France', flag: '🇫🇷' },
                      { name: 'China', flag: '🇨🇳' },
                      { name: 'Japan', flag: '🇯🇵' },
                      { name: 'Netherlands', flag: '🇳🇱' },
                      { name: 'Spain', flag: '🇪🇸' },
                      { name: 'Switzerland', flag: '🇨🇭' },
                      { name: 'Singapore', flag: '🇸🇬' },
                      { name: 'New Zealand', flag: '🇳🇿' },
                      { name: 'Poland', flag: '🇵🇱' },
                      { name: 'Italy', flag: '🇮🇹' },
                      { name: 'South Korea', flag: '🇰🇷' },
                      { name: 'Sweden', flag: '🇸🇪' },
                      { name: 'Norway', flag: '🇳🇴' },
                      { name: 'Denmark', flag: '🇩🇰' },
                      { name: 'Finland', flag: '🇫🇮' },
                      { name: 'Austria', flag: '🇦🇹' },
                      { name: 'Belgium', flag: '🇧🇪' },
                      { name: 'Ireland', flag: '🇮🇪' },
                      { name: 'Malaysia', flag: '🇲🇾' },
                      { name: 'Thailand', flag: '🇹🇭' },
                      { name: 'Brazil', flag: '🇧🇷' },
                      { name: 'Argentina', flag: '🇦🇷' },
                      { name: 'Mexico', flag: '🇲🇽' },
                      { name: 'South Africa', flag: '🇿🇦' },
                      { name: 'Israel', flag: '🇮🇱' },
                      { name: 'UAE', flag: '🇦🇪' },
                      { name: 'Other', flag: '🏳️' }
                    ].map(c => (
                      <option key={c.name} value={c.name} style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label small text-secondary">Rating</label>
                  <div className="d-flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <i 
                        key={star} 
                        className={`bi bi-star-fill ${reviewForm.rating >= star ? 'text-warning' : 'text-secondary'}`} 
                        style={{ cursor: 'pointer', fontSize: '1.5rem', color: reviewForm.rating >= star ? 'var(--color-gold)' : 'var(--text-secondary)' }}
                        onClick={() => setReviewForm({...reviewForm, rating: star})}
                      ></i>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label small text-secondary">Your Review</label>
                  <textarea className="form-control" rows="4" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} required value={reviewForm.review} onChange={(e) => setReviewForm({...reviewForm, review: e.target.value})}></textarea>
                </div>
                <button type="submit" className="btn btn-orange w-100 py-2" disabled={isSubmittingReview}>
                  {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
                {reviewMessage && !isSubmittedSuccess && <div className={`mt-3 small text-center text-danger`}>{reviewMessage}</div>}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ReviewModal;

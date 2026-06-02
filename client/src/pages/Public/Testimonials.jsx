import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [guestName, setGuestName] = useState('');
  const [country, setCountry] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [guestImage, setGuestImage] = useState(null);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews/approved');
      if (res.success) {
        setReviews(res.data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleFileChange = (e) => {
    setGuestImage(e.target.files[0]);
  };

  // Form Field Validation Check
  const isNameValid = guestName.length >= 3 && guestName.length <= 50;
  const isReviewValid = reviewText.length >= 20 && reviewText.length <= 400;
  const isFormValid = isNameValid && isReviewValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!isFormValid) {
      setErrorMsg('Please ensure inputs conform to validation limits.');
      return;
    }

    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('guestName', guestName);
      data.append('country', country);
      data.append('rating', rating);
      data.append('review', reviewText);
      if (guestImage) {
        data.append('image', guestImage);
      }

      const res = await api.post('/reviews', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.success) {
        setSuccessMsg(res.message || 'Review submitted successfully!');
        setGuestName('');
        setCountry('');
        setRating(5);
        setReviewText('');
        setGuestImage(null);
      }
    } catch (err) {
      setErrorMsg(typeof err === 'string' ? err : 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getAPIImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
    return `${baseUrl}${url}`;
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

  return (
    <div className="container py-5 fade-in-up">
      <div className="row justify-content-center text-center mb-5">
        <div className="col-lg-8 col-11">
          <h6 className="text-uppercase fw-semibold" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em', fontSize: '0.75rem' }}>
            Testimonials
          </h6>
          <h1 className="display-4 font-serif fw-bold my-2">Guest Journals</h1>
          <div className="gold-accent-line"></div>
          <p className="lead text-secondary" style={{ fontSize: '1rem' }}>
            Shared stories from travelers who have stepped through our threshold and experienced stillness.
          </p>
        </div>
      </div>

      <div className="row g-5">
        {/* Reviews List */}
        <div className="col-lg-7">
          <div className="d-flex flex-column gap-4">
            {reviews.map(item => (
              <div className="testimonial-card text-start" key={item._id}>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <img src={getAPIImageUrl(item.image) || 'https://img.icons8.com/office/40/user.png'} alt="" className="testimonial-avatar m-0" />
                  <div>
                    <h6 className="mb-0 fw-bold">{item.guestName}</h6>
                    <span className="small text-secondary">{item.country || 'Traveler'}</span>
                  </div>
                </div>
                <div className="mb-2" style={{ color: 'var(--color-gold)' }}>
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <i className="bi bi-star-fill me-1" key={i}></i>
                  ))}
                </div>
                <p className="small text-secondary lh-lg mb-0">"{item.review}"</p>
              </div>
            ))}

            {reviews.length === 0 && (
              <div className="text-center my-4 text-secondary">
                <h5 className="font-serif">No reviews yet. Be the first to share!</h5>
              </div>
            )}
          </div>
        </div>

        {/* Submit Form Sidebar */}
        <div className="col-lg-5">
          <div className="p-4" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
            <h4 className="font-serif fw-bold mb-4">Share Your Experience</h4>
            
            {successMsg && <div className="alert alert-success rounded-0 small py-2">{successMsg}</div>}
            {errorMsg && <div className="alert alert-danger rounded-0 small py-2">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              <div>
                <label className="form-label-luxury">Full Name *</label>
                <input 
                  type="text" 
                  className="form-control form-luxury" 
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  required
                />
                <div className={`char-counter ${guestName.length > 50 || (guestName.length > 0 && guestName.length < 3) ? 'error' : ''}`}>
                  {guestName.length} / 50 characters (min 3)
                </div>
              </div>

              <div>
                <label className="form-label-luxury">Country of Origin</label>
                <input 
                  type="text" 
                  className="form-control form-luxury" 
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  placeholder="e.g. Nepal, USA"
                />
              </div>

              <div>
                <label className="form-label-luxury">Star Rating *</label>
                <select 
                  className="form-select form-luxury" 
                  value={rating}
                  onChange={e => setRating(Number(e.target.value))}
                  required
                >
                  <option value="5">5 Stars (Excellent)</option>
                  <option value="4">4 Stars (Good)</option>
                  <option value="3">3 Stars (Average)</option>
                  <option value="2">2 Stars (Poor)</option>
                  <option value="1">1 Star (Very Bad)</option>
                </select>
              </div>

              <div>
                <label className="form-label-luxury">Your Review Text *</label>
                <textarea 
                  className="form-control form-luxury" 
                  rows="4"
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  required
                ></textarea>
                <div className={`char-counter ${reviewText.length > 400 || (reviewText.length > 0 && reviewText.length < 20) ? 'error' : ''}`}>
                  {reviewText.length} / 400 characters (min 20)
                </div>
              </div>

              <div>
                <label className="form-label-luxury">Upload Photo (Optional)</label>
                <input 
                  type="file" 
                  className="form-control form-luxury" 
                  onChange={handleFileChange}
                  accept="image/*"
                />
                {guestImage && (
                  <div className="mt-2" style={{ maxWidth: '100px', maxHeight: '100px', overflow: 'hidden', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                    <img src={URL.createObjectURL(guestImage)} alt="Guest Preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                className="btn btn-blue w-100 mt-2 py-3"
                disabled={submitting || !isFormValid}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;

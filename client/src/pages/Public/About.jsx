import React, { useState, useEffect } from 'react';
import api, { getAPIImageUrl } from '../../services/api';

const About = () => {
  const [about, setAbout] = useState(null);
  const [family, setFamily] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const res = await api.get('/about');
        if (res.success) {
          setAbout(res.about);
          setFamily(res.family);
        }
      } catch (err) {
        console.error('Error fetching about page details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh', color: 'var(--color-gold)' }}>
        <div className="spinner-border spinner-luxury" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Fallback defaults
  const title = about?.title || 'Our Family & Hospitality';
  const subtitle = about?.subtitle || 'About Us';
  const description = about?.description || 'New Pittam Deurali Guest House & Restaurant was established as a welcoming stopover to share authentic Nepali hospitality...';
  const image = about?.image || '/uploads/image copy 8.png';
  const storyTitle = about?.storyTitle || 'A Heritage of Mountain Hospitality';
  const storyDescription = about?.storyDescription || 'Situated at 2,100 meters along the ridge-top of Pitam Deurali, our guest house has served as a trusted sanctuary for trekkers...';
  const storyImage = about?.storyImage || '/uploads/image.png';

  return (
    <div className="container py-5 fade-in-up">
      {/* 1. Header Section */}
      <div className="row justify-content-center text-center mb-5">
        <div className="col-lg-8">
          <h6 className="text-uppercase fw-semibold" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em', fontSize: '0.75rem' }}>
            {subtitle}
          </h6>
          <h1 className="display-4 font-serif fw-bold my-2">{title}</h1>
          <div className="gold-accent-line"></div>
          <p className="lead text-secondary" style={{ fontSize: '1rem' }}>
            {description}
          </p>
        </div>
      </div>

      {/* 2. Main History / Legacy Row */}
      <div className="row align-items-center g-5 mb-5">
        <div className="col-md-6 col-12">
          <div style={{ border: '1px solid var(--border-color)', padding: '10px', borderRadius: '4px' }}>
            <img 
              src={getAPIImageUrl(image)} 
              alt="Mountain View representation" 
              className="img-fluid w-100"
              style={{ objectFit: 'cover', height: '360px', borderRadius: '2px' }}
            />
          </div>
        </div>
        <div className="col-md-6 col-12">
          <h3 className="font-serif fw-bold mb-3" style={{ color: 'var(--color-gold)' }}>{storyTitle}</h3>
          <p className="lh-lg text-secondary" style={{ fontSize: '0.95rem', textAlign: 'justify' }}>
            {storyDescription}
          </p>
        </div>
      </div>

      {/* 3. Dynamic Family Members Section */}
      {family.length > 0 && (
        <div className="pt-5 mt-5 border-top" style={{ borderColor: 'var(--border-color)' }}>
          <div className="text-center mb-5">
            <h6 className="text-uppercase fw-semibold" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em', fontSize: '0.75rem' }}>
              Family Operated
            </h6>
            <h2 className="display-6 font-serif fw-bold my-2">Meet Our Family</h2>
            <div className="gold-accent-line"></div>
            <p className="small text-secondary">The friendly faces welcoming you to Pitam Deurali ridge.</p>
          </div>

          <div className="row g-4 justify-content-center">
            {family.map((member) => (
              <div className="col-lg-4 col-md-6 col-12" key={member._id}>
                <div className="card-luxury h-100 p-4 text-center d-flex flex-column align-items-center">
                  <div className="mb-3" style={{ width: '130px', height: '130px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--color-gold)' }}>
                    <img 
                      src={getAPIImageUrl(member.image) || 'https://img.icons8.com/office/80/user.png'} 
                      alt={member.name}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <h5 className="font-serif fw-bold text-white mb-1">{member.name}</h5>
                  <span className="small text-gold text-uppercase tracking-wider fw-semibold mb-3" style={{ fontSize: '0.7rem' }}>
                    {member.role}
                  </span>
                  {member.description && (
                    <p className="small text-secondary lh-lg mb-0" style={{ fontSize: '0.85rem' }}>
                      "{member.description}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Second Row - Cozy Philosophy */}
      <div className="row align-items-center g-5 flex-md-row-reverse mt-5 pt-4 border-top" style={{ borderColor: 'var(--border-color)' }}>
        <div className="col-md-6 col-12">
          <div style={{ border: '1px solid var(--border-color)', padding: '10px', borderRadius: '4px' }}>
            <img 
              src={getAPIImageUrl(storyImage)} 
              alt="Lodge dining room" 
              className="img-fluid w-100"
              style={{ objectFit: 'cover', height: '360px', borderRadius: '2px' }}
            />
          </div>
        </div>
        <div className="col-md-6 col-12">
          <h3 className="font-serif fw-bold mb-3" style={{ color: 'var(--color-gold)' }}>The Pittam Deurali Experience</h3>
          <p className="lh-lg text-secondary" style={{ fontSize: '0.95rem' }}>
            We believe that a great journey is defined by the people you meet and the comfort you find along the way. We are dedicated to providing a high-standard, authentic local stay:
          </p>
          <ul className="text-secondary lh-lg d-flex flex-column gap-2 small" style={{ listStyleType: 'none', paddingLeft: 0 }}>
            <li><i className="bi bi-check2 text-success me-2"></i><strong>Comfortable Lodging:</strong> Warm wooden rooms, soft blankets, clean pillows, and reliable hot showers.</li>
            <li><i className="bi bi-check2 text-success me-2"></i><strong>Authentic Local Dining:</strong> Wood-fire cooked Nepali Dal Bhat and local organic tea using ingredients from our garden.</li>
            <li><i className="bi bi-check2 text-success me-2"></i><strong>Trekking Guidance:</strong> Direct trail logistics, safety tips, and guide coordination by hosts who know these mountains by heart.</li>
            <li><i className="bi bi-check2 text-success me-2"></i><strong>Family Environment:</strong> Share tea, warm stories, and laughter with our family by the fireplace in the evening.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;

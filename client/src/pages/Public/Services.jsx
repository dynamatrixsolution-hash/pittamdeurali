import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import SEO from '../../components/SEO';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        if (res.success) {
          setServices(res.data);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
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

  return (
    <div className="container py-5 fade-in-up">
      <SEO 
        title="Our Services & Amenities | Pitam Deurali Guest House"
        description="Enjoy hot showers, high-speed Wi-Fi, gear rental, luggage storage, and local trekking guides at Pitam Deurali Guest House in Pothana, Kaski, Nepal."
        keywords={[
          "Pothana Guest House Services", "Deurali Guest House Amenities", "Hot Showers in Pothana", 
          "Wi-Fi Trekking Lodge Nepal", "Luggage Storage Dhampus", "Trekking Guide Service Pothana", 
          "Mardi Himal Accommodation Services", "Annapurna Trek Lodge Amenities", "Stay in Pothana Services", 
          "Best Guest House in Dhampus Amenities", "Budget Hotel Dhampus Services", "Family Guest House Nepal Amenities", 
          "Trekker Friendly Lodge Services", "Pokhara Trekking Stay Amenities", "Gandaki Province Lodge Services", 
          "Himalayan Lodge Wi-Fi", "Hot Water Lodge Dhampus", "Pothana Local Guides"
        ]}
        slug="/services"
      />
      <div className="row justify-content-center text-center mb-5">
        <div className="col-lg-8 col-11">
          <h6 className="text-uppercase fw-semibold" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em', fontSize: '0.75rem' }}>
            Services
          </h6>
          <h1 className="display-4 font-serif fw-bold my-2">Guest House Services</h1>
          <div className="gold-accent-line"></div>
          <p className="lead text-secondary" style={{ fontSize: '1rem' }}>
            Conveniences and facilities provided to ensure a comfortable stay in our mountain guest house.
          </p>
        </div>
      </div>

      <div className="row g-4 mt-2">
        {services.map(ser => (
          <div className="col-lg-4 col-md-6" key={ser._id}>
            <div className="card-luxury p-5 h-100 d-flex flex-column align-items-center text-center">
              <div className="fs-1 mb-4" style={{ color: 'var(--color-gold)' }}>
                <i className={`bi ${ser.icon}`}></i>
              </div>
              <h4 className="font-serif fw-bold mb-3">{ser.title}</h4>
              <p className="small text-secondary lh-lg mb-0">{ser.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;

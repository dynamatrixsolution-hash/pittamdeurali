import React from 'react';
import SEO from '../../components/SEO';

const Location = () => {
  return (
    <div className="container py-5 fade-in-up">
      <SEO 
        title="Location & Map | New Pittam Deurali Guest House and Restaurant"
        description="Find detailed maps, transport guides, and directions to New Pittam Deurali Guest House and Restaurant in Pittam Deurali. Easily accessible from Pokhara and Dhampus."
        keywords={[
          "New Pittam Deurali Guest House", "Pittam Deurali Location", "Deurali Guest House Map",
          "Hotel in Pittam Deurali Location", "Hotel in Dhampus Map", "Guest House near Mardi Himal Route",
          "Hotel near Australian Camp Map", "Stay in Deurali Directions", "Best Guest House in Lumle Location",
          "Pokhara Trekking Stay Map", "Annapurna Region Hotel Location", "Gandaki Province Deurali Map",
          "Kaski Nepal Trekking Hub", "Family Guest House Nepal Location", "Budget Hotel Dhampus Location",
          "Kande Accommodation", "Kande Guest House", "Kande Trekking Lodge", "Hotel Near Kande", 
          "Stay Near Kande", "Pokhara Trekking Accommodation", "Pokhara Trek Lodge", "Pokhara Mountain View Hotel", 
          "Kaski Trekking Lodge", "Gandaki Province Accommodation", "Himalayan View Accommodation Nepal", 
          "Nepal Trekking Accommodation", "Trekking Lodge Nepal", "Mountain Guest House Nepal", 
          "Best Trekking Hotel Nepal", "Hotel Near Australian Camp", "Australian Camp Accommodation", 
          "Australian Camp Guest House", "Australian Camp Trekking Lodge", "Stay Near Australian Camp", 
          "Lodge Near Australian Camp", "Budget Accommodation Australian Camp", "Best Hotel Near Australian Camp", 
          "Australian Camp Trek Stop", "Overnight Stay Near Australian Camp", "Australian Camp View Hotel", 
          "Annapurna View Accommodation", "Himalayan View Lodge Australian Camp"
        ]}
        slug="/location"
      />

      <div className="row justify-content-center text-center mb-5">
        <div className="col-lg-8 col-11">
          <h6 className="text-uppercase fw-semibold" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em', fontSize: '0.75rem' }}>
            Getting Here
          </h6>
          <h1 className="display-4 font-serif fw-bold my-2">Our Location</h1>
          <div className="gold-accent-line"></div>
          <p className="lead text-secondary" style={{ fontSize: '1rem' }}>
            Situated on the beautiful ridge-top of Pittam Deurali, Nepal, offering panoramic Himalayan views and a perfect rest point for trekkers.
          </p>
        </div>
      </div>

      <div className="row g-5 align-items-stretch mb-5">
        {/* Contact Info & Driving Details */}
        <div className="col-lg-5 d-flex flex-column justify-content-between">
          <div className="card-luxury p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <h3 className="font-serif fw-bold mb-4" style={{ color: 'var(--color-gold)' }}>Contact & Coordinates</h3>
              
              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="fs-4 text-gold mt-1"><i className="bi bi-geo-alt"></i></div>
                <div>
                  <h6 className="fw-bold mb-1">Address</h6>
                  <p className="small text-muted mb-0">Pittam Deurali, Lumle 33700, Kaski, Nepal</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="fs-4 text-gold mt-1"><i className="bi bi-telephone"></i></div>
                <div>
                  <h6 className="fw-bold mb-1">Phone Inquiry</h6>
                  <p className="small text-muted mb-0">+977 9866061995</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="fs-4 text-gold mt-1"><i className="bi bi-envelope"></i></div>
                <div>
                  <h6 className="fw-bold mb-1">Email Support</h6>
                  <p className="small text-muted mb-0">stay@pittamdeuraliguesthouse.com</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="fs-4 text-gold mt-1"><i className="bi bi-compass"></i></div>
                <div>
                  <h6 className="fw-bold mb-1">Coordinates</h6>
                  <p className="small text-muted mb-0">28.3254° N, 83.8291° E (Pittam Deurali)</p>
                </div>
              </div>
            </div>

            <div className="border-top pt-4 mt-3" style={{ borderColor: 'var(--border-color)' }}>
              <h6 className="fw-bold mb-2">Trekkers Info</h6>
              <p className="small text-muted mb-0">
                Pothana is a key checkpoint inside the Annapurna Conservation Area Project (ACAP). Ensure you have your TIMS card and permits stamped.
              </p>
            </div>
          </div>
        </div>

        {/* Map Embedding Container */}
        <div className="col-lg-7">
          <div className="card-luxury p-3 h-100" style={{ minHeight: '400px' }}>
            <iframe 
              title="New Pittam Deurali Guest House and Restaurant Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3512.6961448834926!2d83.82687381502476!3d28.325437499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3995efb8c329d831%3A0xf432096954be174b!2sNew%20Pittam%20Deurali%20Guest%20House%20and%20Restaurant!5e0!3m2!1sen!2snp!4v1717900000000!5m2!1sen!2snp" 
              width="100%" 
              height="100%" 
              style={{ border: 0, minHeight: '380px', borderRadius: '4px' }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Access Routes Guide */}
      <h3 className="font-serif fw-bold mb-4 text-center mt-5">How to Reach Us</h3>
      <div className="row g-4 justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card-luxury p-4 text-center h-100">
            <div className="fs-1 text-gold mb-3"><i className="bi bi-cursor"></i></div>
            <h5 className="font-serif fw-bold mb-3">Via Dhampus (Hiking Route)</h5>
            <p className="small text-secondary lh-lg mb-0">
              Take a local bus or private taxi from Pokhara (Hari Chowk) to Phedi or Dhampus Village. From Dhampus, enjoy a scenic 2-3 hour hike up the stone steps passing through terraced fields to Pothana.
            </p>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card-luxury p-4 text-center h-100">
            <div className="fs-1 text-gold mb-3"><i className="bi bi-compass-fill"></i></div>
            <h5 className="font-serif fw-bold mb-3">Via Kande & Australian Camp</h5>
            <p className="small text-secondary lh-lg mb-0">
              Drive 45 minutes from Pokhara to Kande. Hike 1-1.5 hours to the famous Australian Camp. From Australian Camp, it is a pleasant, flat forest ridge walk of 40-50 minutes to Pothana Deurali.
            </p>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card-luxury p-4 text-center h-100">
            <div className="fs-1 text-gold mb-3"><i className="bi bi-signpost-split"></i></div>
            <h5 className="font-serif fw-bold mb-3">Mardi Himal Descent Route</h5>
            <p className="small text-secondary lh-lg mb-0">
              When returning from Mardi Himal Base Camp or High Camp, instead of going to Kalimati or Siding, descend to Forest Camp and hike 3-4 hours via Deurali to rest in Pothana before returning to Pokhara.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Location;

import React, { useState, useEffect } from 'react';
import api, { getAPIImageUrl } from '../../services/api';
import SEO from '../../components/SEO';

const Restaurant = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [settings, setSettings] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const [catsRes, itemsRes, settingsRes, restaurantRes] = await Promise.all([
          api.get('/menu-categories'),
          api.get('/menu-items'),
          api.get('/settings'),
          api.get('/restaurant')
        ]);
        if (catsRes.success) setCategories(catsRes.data);
        if (itemsRes.success) setMenuItems(itemsRes.data.filter(item => item.availabilityStatus));
        if (settingsRes.success) setSettings(settingsRes.data);
        if (restaurantRes.success) setRestaurant(restaurantRes.data);
      } catch (err) {
        console.error('Error fetching restaurant menu page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuData();
  }, []);


  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const renderPrice = (item) => {
    if (!settings) return null;
    
    const isGlobalDisabled = !settings.showPricesPublicly;
    const isItemDisabled = item.showPriceToggle === false;
    
    // 1. If public pricing is disabled globally or individually
    if (isGlobalDisabled || isItemDisabled) {
      if (settings.showContactForPriceInstead || isItemDisabled) {
        return (
          <span className="small text-gold fw-semibold">
            <a 
              href={`https://wa.me/${settings.whatsappNumber ? settings.whatsappNumber.replace(/[+\s-]/g, '') : '9779801234567'}?text=Hi,%20I'm%20interested%20in%20the%20price%20of%20the%20${encodeURIComponent(item.name)}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none text-gold d-inline-flex align-items-center"
              style={{ color: 'var(--color-gold)' }}
              onClick={e => e.stopPropagation()}
            >
              Contact for Price <i className="bi bi-whatsapp ms-1 text-success"></i>
            </a>
          </span>
        );
      }
      return null; // hide completely
    }

    // 2. If public pricing is enabled
    const hasDiscount = settings.enableDiscounts && item.discountPrice !== null && item.discountPrice !== undefined;
    const highlight = settings.highlightDiscountedItems && hasDiscount;

    if (hasDiscount) {
      const discountPercentage = Math.round(((item.price - item.discountPrice) / item.price) * 100);
      return (
        <div className="d-flex align-items-center flex-wrap gap-2">
          <span className="menu-price-original text-muted text-decoration-line-through">${Number(item.price).toFixed(2)}</span>
          <span className={highlight ? 'menu-price-highlighted text-danger fw-bold' : 'menu-price-active fw-bold'} style={{ color: highlight ? 'var(--color-error)' : 'var(--color-gold)' }}>
            ${Number(item.discountPrice).toFixed(2)}
          </span>
          {highlight && (
            <span className="menu-badge-discount badge text-uppercase px-2 py-0.5" style={{ fontSize: '0.65rem', backgroundColor: 'var(--color-orange)', color: '#FFFFFF' }}>
              -{discountPercentage}%
            </span>
          )}
        </div>
      );
    }

    // Standard price
    return <span className="menu-price-active fw-bold" style={{ color: 'var(--color-gold)' }}>${Number(item.price).toFixed(2)}</span>;
  };

  return (
    <div className="container py-5 fade-in-up">
      <SEO 
        title="Local Restaurant & Dining | Pitam Deurali Guest House"
        description="Enjoy delicious Nepali Dal Bhat and international cuisine at Pitam Deurali Restaurant in Pothana. Fuel up for your Mardi Himal and Annapurna trekking."
        keywords={[
          "Pothana Restaurant", "Dhampus Dining", "Best Dal Bhat in Pothana", "Mardi Himal Trek Food", 
          "Deurali Guest House Restaurant", "Annapurna Trek Lodge Food", "Trekking Lodge Nepal Restaurant", 
          "Local Organic Food Kaski", "Nepalese Cuisine Pothana", "Breakfast in Dhampus", 
          "Trekker Friendly Lodge Dining", "Mountain View Restaurant Pokhara", "Stay in Pothana Food", 
          "Pokhara Trekking Stay Restaurant", "Gandaki Province Traditional Food", "Family Guest House Nepal Restaurant", 
          "Deurali Coffee Shop", "Himalayan Organic Dining"
        ]}
        slug="/restaurant"
      />
      <div className="row justify-content-center text-center mb-5">
        <div className="col-lg-8 col-12">
          <h6 className="text-uppercase fw-semibold" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em', fontSize: '0.75rem' }}>
            {restaurant?.subtitle || 'Traditional Dining'}
          </h6>
          <h1 className="display-4 font-serif fw-bold my-2">{restaurant?.title || 'New Pittam Deurali Restaurant'}</h1>
          <div className="gold-accent-line"></div>
          <p className="lead text-secondary" style={{ fontSize: '1rem' }}>
            Savor authentic wood-fired Nepali cuisine, freshly harvested garden vegetables, and warm hospitality at our ridge-top dining hall.
          </p>
        </div>
      </div>

      {/* Overview & Food Philosophy */}
      <div className="row align-items-center g-5 mb-5">
        <div className="col-lg-6 col-12">
          <h3 className="font-serif fw-bold mb-3">A True Family Kitchen</h3>
          <p className="lh-lg text-secondary" style={{ fontSize: '0.95rem' }}>
            {restaurant?.description || 'At New Pittam Deurali Guest House & Restaurant, dining is at the heart of our hospitality. Our family kitchen prepares every meal over a traditional wood-fired stove, imparting a rich, authentic smoky flavor to local dishes. We serve wholesome, fresh meals designed to re-energize trekkers who have walked the forest trails from Kande or are continuing to Mardi Himal.'}
          </p>
          <p className="lh-lg text-secondary" style={{ fontSize: '0.95rem' }}>
            Whether you sit in our warm indoor wooden dining room or enjoy your meal outside with panoramic mountain views, you will feel the comfort of a genuine home-cooked meal.
          </p>
        </div>
        <div className="col-lg-6 col-12">
          <div style={{ border: '1px solid var(--border-color)', padding: '10px', borderRadius: '4px' }}>
            <img 
              src={getAPIImageUrl(restaurant?.coverImage || "/uploads/image copy 6.png")} 
              alt="Cozy Dining Area" 
              className="img-fluid w-100"
              style={{ objectFit: 'cover', height: '360px', borderRadius: '2px' }}
            />
          </div>
        </div>
      </div>

      {/* Nepali Cuisine & Local Ingredients */}
      <div className="row align-items-center g-5 flex-lg-row-reverse mb-5">
        <div className="col-lg-6 col-12">
          <h3 className="font-serif fw-bold mb-3">Fresh, Organic & Local</h3>
          <p className="lh-lg text-secondary" style={{ fontSize: '0.95rem' }}>
            We believe in farm-to-table food. Our vegetable curries and side salads are prepared using fresh produce harvested directly from our own garden or sourced from organic cooperatives in the surrounding Lumle area.
          </p>
          <div className="row g-3 mt-1">
            {restaurant?.features && restaurant.features.length > 0 ? (
              restaurant.features.map((feat, idx) => (
                <div className="col-6" key={idx}>
                  <div className="p-3 border h-100" style={{ borderColor: 'var(--border-color)', borderRadius: '4px', backgroundColor: 'var(--bg-secondary)' }}>
                    <h6 className="fw-bold mb-0 text-white" style={{ fontSize: '0.85rem' }}>
                      <i className="bi bi-patch-check-fill me-2 text-success"></i> {feat}
                    </h6>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="col-6">
                  <div className="p-3 border h-100" style={{ borderColor: 'var(--border-color)', borderRadius: '4px', backgroundColor: 'var(--bg-secondary)' }}>
                    <h6 className="fw-bold mb-2"><i className="bi bi-fire me-2 text-warning"></i> Traditional Cooking</h6>
                    <p className="small text-secondary mb-0">Meals prepared slowly over wood fire following generation-old family recipes.</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 border h-100" style={{ borderColor: 'var(--border-color)', borderRadius: '4px', backgroundColor: 'var(--bg-secondary)' }}>
                    <h6 className="fw-bold mb-2"><i className="bi bi-tree me-2 text-success"></i> 100% Organic</h6>
                    <p className="small text-secondary mb-0">Local seasonal vegetables, home-ground lentils, and hand-selected mountain spices.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="col-lg-6 col-12">
          <div style={{ border: '1px solid var(--border-color)', padding: '10px', borderRadius: '4px' }}>
            <img 
              src={getAPIImageUrl(restaurant?.galleryImages && restaurant.galleryImages.length > 0 ? restaurant.galleryImages[0] : "/uploads/image copy 7.png")} 
              alt="Traditional Nepali Dal Bhat" 
              className="img-fluid w-100"
              style={{ objectFit: 'cover', height: '360px', borderRadius: '2px' }}
            />
          </div>
        </div>
      </div>

      {/* Restaurant Gallery Section */}
      {restaurant?.galleryImages && restaurant.galleryImages.length > 0 && (
        <div className="my-5 py-4 border-top border-bottom" style={{ borderColor: 'var(--border-color)' }}>
          <h3 className="font-serif fw-bold text-center mb-4">Our Kitchen & Dining Gallery</h3>
          <div className="row g-3">
            {restaurant.galleryImages.map((img, idx) => (
              <div className="col-md-4 col-sm-6 col-12" key={idx}>
                <div style={{ height: '200px', overflow: 'hidden', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                  <img 
                    src={getAPIImageUrl(img)} 
                    alt={`Restaurant gallery photo ${idx + 1}`} 
                    className="w-100 h-100" 
                    style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Food Menu Section */}
      <div className="pt-5 mt-5 border-top border-secondary">
        <h2 className="font-serif fw-bold text-center mb-4">Our Food & Kitchen Menu</h2>
        
        {/* Search Bar */}
        <div className="menu-search-bar mb-4">
          <div className="input-group">
            <span className="input-group-text bg-secondary border-0 text-muted"><i className="bi bi-search"></i></span>
            <input 
              type="text" 
              className="form-control form-luxury border-0" 
              placeholder="Search dishes, drinks, appetizers..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="d-flex flex-wrap justify-content-center gap-1 mb-5">
          <button 
            onClick={() => setActiveCategory('All')}
            className={`btn btn-sm px-4 py-2 border-0 rounded-0 text-uppercase small ${activeCategory === 'All' ? 'btn-green' : 'btn-green-outline'}`}
            style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
          >
            All Items
          </button>
          {categories.map(cat => (
            <button 
              key={cat._id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`btn btn-sm px-4 py-2 border-0 rounded-0 text-uppercase small ${activeCategory === cat.slug ? 'btn-green' : 'btn-green-outline'}`}
              style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center p-5"><div className="spinner-border spinner-luxury" /></div>
        ) : (
          <div className="row g-4">
            {filteredItems.map((item) => (
              <div className="col-lg-6 col-12" key={item._id}>
                <div className="menu-item-card d-flex align-items-center gap-3 p-3 h-100">
                  <div style={{ width: '90px', height: '90px', flexShrink: 0 }}>
                    <img 
                      src={getAPIImageUrl(item.image || '/uploads/image.png')} 
                      alt={item.name} 
                      className="w-100 h-100"
                      style={{ objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                    />
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between flex-wrap align-items-center border-bottom pb-1 mb-2" style={{ borderColor: 'var(--border-color)' }}>
                      <h5 className="font-serif mb-0 fs-6 d-flex align-items-center flex-wrap gap-2">
                        {item.name}
                        {item.popularBadge && (
                          <span className="badge text-uppercase font-sans px-1.5 py-0.5" style={{ fontSize: '0.55rem', letterSpacing: '0.05em', backgroundColor: 'var(--color-orange)', color: '#FFFFFF' }}>
                            Special
                          </span>
                        )}
                      </h5>
                      {renderPrice(item)}
                    </div>
                    <p className="small text-secondary mb-0">{item.description || 'Prepared fresh by local ingredients.'}</p>
                  </div>
                </div>
              </div>
            ))}

            {filteredItems.length === 0 && (
              <div className="col-12 text-center py-5">
                <p className="text-secondary small">No menu items found in this category.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurant;

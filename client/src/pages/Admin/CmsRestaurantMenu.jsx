import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const CmsRestaurantMenu = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('items'); // 'items' or 'categories'
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals / Form State for Item
  const [itemFormView, setItemFormView] = useState('list'); // 'list', 'add', 'edit'
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [itemForm, setItemForm] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    discountPrice: '',
    popularBadge: false,
    availabilityStatus: true,
    showPriceToggle: true
  });
  const [itemImageFile, setItemImageFile] = useState(null);
  const [existingItemImage, setExistingItemImage] = useState('');

  // Modals / Form State for Category
  const [categoryFormView, setCategoryFormView] = useState('list'); // 'list', 'add', 'edit'
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [catsRes, itemsRes] = await Promise.all([
        api.get('/menu-categories'),
        api.get('/menu-items')
      ]);

      if (catsRes.success) setCategories(catsRes.data);
      if (itemsRes.success) setItems(itemsRes.data);
    } catch (err) {
      console.error('Error fetching restaurant menu details:', err);
      setMsg({ type: 'danger', text: 'Failed to load restaurant data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMessage = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: '', text: '' }), 5000);
  };

  // --- Category Handlers ---
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post('/menu-categories', { name: categoryName });
      if (res.success) {
        handleMessage('success', `Category "${res.data.name}" created successfully.`);
        setCategoryName('');
        setCategoryFormView('list');
        loadData();
      }
    } catch (err) {
      handleMessage('danger', typeof err === 'string' ? err : 'Failed to create category.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim() || !selectedCategoryId) return;
    setSubmitting(true);
    try {
      const res = await api.put(`/menu-categories/${selectedCategoryId}`, { name: categoryName });
      if (res.success) {
        handleMessage('success', 'Category updated successfully.');
        setCategoryName('');
        setSelectedCategoryId(null);
        setCategoryFormView('list');
        loadData();
      }
    } catch (err) {
      handleMessage('danger', typeof err === 'string' ? err : 'Failed to update category.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"? Items linked to its slug will remain but might lack a category structure.`)) return;
    try {
      const res = await api.delete(`/menu-categories/${id}`);
      if (res.success) {
        handleMessage('success', 'Category deleted successfully.');
        loadData();
      }
    } catch (err) {
      handleMessage('danger', typeof err === 'string' ? err : 'Failed to delete category.');
    }
  };

  const startEditCategory = (cat) => {
    setSelectedCategoryId(cat._id);
    setCategoryName(cat.name);
    setCategoryFormView('edit');
  };

  // --- Item Handlers ---
  const handleItemFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setItemForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    if (!itemForm.name.trim() || !itemForm.category || !itemForm.price) {
      handleMessage('danger', 'Please fill in all required fields (Name, Category, Price).');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('name', itemForm.name);
    formData.append('category', itemForm.category);
    formData.append('description', itemForm.description);
    formData.append('price', itemForm.price);
    
    if (itemForm.discountPrice) {
      formData.append('discountPrice', itemForm.discountPrice);
    } else {
      formData.append('discountPrice', '');
    }
    
    formData.append('popularBadge', itemForm.popularBadge);
    formData.append('availabilityStatus', itemForm.availabilityStatus);
    formData.append('showPriceToggle', itemForm.showPriceToggle);

    if (itemImageFile) {
      formData.append('image', itemImageFile);
    }

    try {
      let res;
      if (itemFormView === 'add') {
        res = await api.post('/menu-items', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await api.put(`/menu-items/${selectedItemId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (res.success) {
        handleMessage('success', `Menu item "${res.data.name}" ${itemFormView === 'add' ? 'created' : 'updated'} successfully.`);
        resetItemForm();
        setItemFormView('list');
        loadData();
      }
    } catch (err) {
      handleMessage('danger', typeof err === 'string' ? err : 'Error saving menu item details.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete menu item "${name}"?`)) return;
    try {
      const res = await api.delete(`/menu-items/${id}`);
      if (res.success) {
        handleMessage('success', 'Menu item deleted successfully.');
        loadData();
      }
    } catch (err) {
      handleMessage('danger', typeof err === 'string' ? err : 'Failed to delete menu item.');
    }
  };

  const resetItemForm = () => {
    setItemForm({
      name: '',
      category: '',
      description: '',
      price: '',
      discountPrice: '',
      popularBadge: false,
      availabilityStatus: true,
      showPriceToggle: true
    });
    setItemImageFile(null);
    setExistingItemImage('');
    setSelectedItemId(null);
  };

  const startAddItem = () => {
    resetItemForm();
    if (categories.length > 0) {
      // Default to first category slug
      const firstCat = categories[0].slug || categories[0].name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      setItemForm(prev => ({ ...prev, category: firstCat }));
    }
    setItemFormView('add');
  };

  const startEditItem = (item) => {
    setSelectedItemId(item._id);
    setItemForm({
      name: item.name,
      category: item.category,
      description: item.description || '',
      price: item.price,
      discountPrice: item.discountPrice !== null ? item.discountPrice : '',
      popularBadge: item.popularBadge || false,
      availabilityStatus: item.availabilityStatus ?? true,
      showPriceToggle: item.showPriceToggle ?? true
    });
    setExistingItemImage(item.image);
    setItemImageFile(null);
    setItemFormView('edit');
  };

  // Helpers
  const getAPIImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
    return `${baseUrl}${url}`;
  };

  const getCategoryName = (slug) => {
    const cat = categories.find(c => c.slug === slug);
    return cat ? cat.name : slug;
  };

  // Metrics calculation
  const totalItems = items.length;
  const totalCats = categories.length;
  const discountedItemsCount = items.filter(item => item.discountPrice !== null && item.discountPrice !== undefined).length;

  // Filter & Search Logic
  const filteredItems = items
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = categoryFilter === '' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let aField = a[sortField];
      let bField = b[sortField];

      // Handle cases
      if (typeof aField === 'string') {
        aField = aField.toLowerCase();
        bField = bField.toLowerCase();
      }

      if (aField < bField) return sortOrder === 'asc' ? -1 : 1;
      if (aField > bField) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="fade-in-up text-white">
      {/* 1. Header & Primary Navigation Tabs */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h3 className="font-serif fw-bold m-0">Restaurant Menu Dashboard</h3>
          <p className="text-secondary small m-0">Manage food categories, pricing rules, discounts, and item details.</p>
        </div>
        
        <div className="d-flex gap-2 mt-3 mt-md-0">
          <button 
            className={`btn btn-sm px-4 py-2 border-0 rounded-0 text-uppercase small ${activeSubTab === 'items' ? 'btn-luxury' : 'btn-luxury-outline'}`}
            style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
            onClick={() => { setActiveSubTab('items'); setItemFormView('list'); }}
          >
            <i className="bi bi-journal-menu me-2"></i> Menu Items
          </button>
          <button 
            className={`btn btn-sm px-4 py-2 border-0 rounded-0 text-uppercase small ${activeSubTab === 'categories' ? 'btn-luxury' : 'btn-luxury-outline'}`}
            style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
            onClick={() => { setActiveSubTab('categories'); setCategoryFormView('list'); }}
          >
            <i className="bi bi-tags me-2"></i> Categories
          </button>
        </div>
      </div>

      {msg.text && <div className={`alert alert-${msg.type} rounded-0 py-2 mb-4`}>{msg.text}</div>}

      {/* 2. Metrics Ribbon */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card-luxury p-3 h-100 d-flex justify-content-between align-items-center">
            <div>
              <span className="small text-uppercase tracking-wider text-muted" style={{ fontSize: '0.65rem' }}>Total Dishes</span>
              <h3 className="fw-bold mb-0 mt-1">{totalItems}</h3>
            </div>
            <div className="fs-3 text-gold" style={{ color: 'var(--color-gold)' }}><i className="bi bi-egg-fried"></i></div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card-luxury p-3 h-100 d-flex justify-content-between align-items-center">
            <div>
              <span className="small text-uppercase tracking-wider text-muted" style={{ fontSize: '0.65rem' }}>Active Categories</span>
              <h3 className="fw-bold mb-0 mt-1">{totalCats}</h3>
            </div>
            <div className="fs-3 text-info"><i className="bi bi-tags"></i></div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card-luxury p-3 h-100 d-flex justify-content-between align-items-center">
            <div>
              <span className="small text-uppercase tracking-wider text-muted" style={{ fontSize: '0.65rem' }}>Discounts Active</span>
              <h3 className="fw-bold mb-0 mt-1 text-success">{discountedItemsCount}</h3>
            </div>
            <div className="fs-3 text-success"><i className="bi bi-percent"></i></div>
          </div>
        </div>
      </div>

      {/* 3. Sub-Tab Content: Menu Items */}
      {activeSubTab === 'items' && (
        <>
          {itemFormView === 'list' ? (
            <>
              {/* Search, Filter & Sort Controls */}
              <div className="row g-3 mb-4 align-items-center">
                <div className="col-md-4">
                  <div className="input-group">
                    <span className="input-group-text bg-secondary border-0 text-muted"><i className="bi bi-search"></i></span>
                    <input 
                      type="text" 
                      className="form-control form-luxury border-0" 
                      placeholder="Search dish name..." 
                      value={searchQuery}
                      onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <select 
                    className="form-select admin-select" 
                    value={categoryFilter}
                    onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                  >
                    <option value="">All Categories</option>
                    {categories.map(c => (
                      <option key={c._id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3 d-flex align-items-center gap-2">
                  <span className="small text-muted text-nowrap">Sort:</span>
                  <select 
                    className="form-select admin-select" 
                    value={sortField}
                    onChange={e => setSortField(e.target.value)}
                  >
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                    <option value="createdAt">Date Created</option>
                  </select>
                  <button 
                    className="btn btn-sm btn-luxury-outline border-0 p-2"
                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                    title="Toggle Sort Order"
                  >
                    {sortOrder === 'asc' ? <i className="bi bi-sort-alpha-down"></i> : <i className="bi bi-sort-alpha-down-alt"></i>}
                  </button>
                </div>

                <div className="col-md-2 text-md-end">
                  <button className="btn btn-luxury w-100 py-2" onClick={startAddItem}>
                    <i className="bi bi-plus-lg me-1"></i> New Dish
                  </button>
                </div>
              </div>

              {/* Items Table */}
              {loading ? (
                <div className="text-center p-5"><div className="spinner-border spinner-luxury" /></div>
              ) : (
                <div className="table-luxury">
                  <table className="table table-dark mb-0 align-middle small">
                    <thead>
                      <tr>
                        <th className="py-3 px-4" style={{ width: '80px' }}>Image</th>
                        <th className="py-3">Dish / Item Name</th>
                        <th className="py-3">Category</th>
                        <th className="py-3">Original Price</th>
                        <th className="py-3">Promo Price</th>
                        <th className="py-3 text-center">Badges / Status</th>
                        <th className="py-3 px-4 text-end" style={{ width: '180px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map(item => (
                        <tr key={item._id}>
                          <td className="py-2 px-4">
                            <img 
                              src={getAPIImageUrl(item.image) || '/uploads/image.png'} 
                              alt="" 
                              style={{ width: '55px', height: '55px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                            />
                          </td>
                          <td className="py-2">
                            <div className="fw-bold text-white">{item.name}</div>
                            {item.description && <div className="text-muted text-truncate small" style={{ maxWidth: '240px' }}>{item.description}</div>}
                          </td>
                          <td className="py-2 text-secondary">{getCategoryName(item.category)}</td>
                          <td className="py-2 fw-semibold text-white">${Number(item.price).toFixed(2)}</td>
                          <td className="py-2">
                            {item.discountPrice !== null && item.discountPrice !== undefined ? (
                              <span className="text-success fw-bold">${Number(item.discountPrice).toFixed(2)}</span>
                            ) : (
                              <span className="text-muted small">-</span>
                            )}
                          </td>
                          <td className="py-2 text-center">
                            <div className="d-flex justify-content-center gap-1">
                              {item.popularBadge && <span className="badge bg-warning text-dark text-uppercase" style={{ fontSize: '0.65rem' }}>Popular</span>}
                              {item.availabilityStatus ? (
                                <span className="badge bg-success text-uppercase" style={{ fontSize: '0.65rem' }}>In Stock</span>
                              ) : (
                                <span className="badge bg-danger text-uppercase" style={{ fontSize: '0.65rem' }}>Out</span>
                              )}
                              {!item.showPriceToggle && <span className="badge bg-secondary text-uppercase" style={{ fontSize: '0.65rem' }}>Price Hidden</span>}
                            </div>
                          </td>
                          <td className="py-2 px-4 text-end">
                            <button className="btn btn-sm btn-luxury-outline border-0 me-2 py-1 px-2" onClick={() => startEditItem(item)}>
                              <i className="bi bi-pencil-square"></i> Edit
                            </button>
                            <button className="btn btn-sm btn-outline-danger border-0 py-1 px-2" onClick={() => handleDeleteItem(item._id, item.name)}>
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                      {currentItems.length === 0 && (
                        <tr>
                          <td colSpan="7" className="text-center py-5 text-secondary">
                            No menu items found matching filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <nav>
                    <ul className="pagination gap-1">
                      {Array.from({ length: totalPages }).map((_, idx) => (
                        <li key={idx} className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}>
                          <button className="page-link admin-page-link" onClick={() => handlePageChange(idx + 1)}>
                            {idx + 1}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              )}
            </>
          ) : (
            // Add/Edit Form for Items
            <form onSubmit={handleItemSubmit} className="p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2" style={{ borderColor: 'var(--border-color)' }}>
                <h5 className="font-serif fw-bold text-white m-0" style={{ color: 'var(--color-gold) !important' }}>
                  {itemFormView === 'add' ? 'Add New Food Menu Item' : 'Edit Menu Item Details'}
                </h5>
                <button type="button" className="btn btn-sm btn-luxury-outline" onClick={() => setItemFormView('list')}>
                  Back to List
                </button>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label-luxury">Item/Dish Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    className="form-control form-luxury" 
                    value={itemForm.name} 
                    onChange={handleItemFormChange} 
                    required 
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label-luxury">Category *</label>
                  <select 
                    name="category" 
                    className="form-select admin-select" 
                    value={itemForm.category} 
                    onChange={handleItemFormChange} 
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c._id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label-luxury">Original Price ($) *</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    name="price" 
                    className="form-control form-luxury" 
                    value={itemForm.price} 
                    onChange={handleItemFormChange} 
                    required 
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label-luxury">Discounted / Promo Price ($) (Optional)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    name="discountPrice" 
                    className="form-control form-luxury" 
                    value={itemForm.discountPrice} 
                    onChange={handleItemFormChange} 
                  />
                  <div className="small text-secondary mt-1">Leave empty to run no discount on this dish.</div>
                </div>

                <div className="col-12">
                  <label className="form-label-luxury">Description & Ingredients</label>
                  <textarea 
                    name="description" 
                    className="form-control form-luxury" 
                    rows="3" 
                    value={itemForm.description} 
                    onChange={handleItemFormChange} 
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label-luxury">Dish Photo</label>
                  <input 
                    type="file" 
                    className="form-control form-luxury" 
                    onChange={e => setItemImageFile(e.target.files[0])} 
                    accept="image/*" 
                  />
                  <div className="small text-secondary mt-1">Use a high quality image showing the plated dish.</div>
                  {itemImageFile && (
                    <div className="mt-2" style={{ maxWidth: '100px', maxHeight: '100px', overflow: 'hidden', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                      <img src={URL.createObjectURL(itemImageFile)} alt="Upload Preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>
                  )}
                </div>

                <div className="col-md-6">
                  {itemFormView === 'edit' && existingItemImage && !itemImageFile && (
                    <div>
                      <span className="form-label-luxury d-block">Current Plated Dish Image</span>
                      <img 
                        src={getAPIImageUrl(existingItemImage)} 
                        alt="Current plated representation" 
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Switches */}
              <div className="row g-3 mb-4 border-top pt-3" style={{ borderColor: 'var(--border-color)' }}>
                <div className="col-md-4">
                  <div className="form-check form-switch">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      name="popularBadge" 
                      id="popularBadge"
                      checked={itemForm.popularBadge}
                      onChange={handleItemFormChange}
                    />
                    <label className="form-check-label text-white ms-2" htmlFor="popularBadge">
                      Mark as "Chef Special / Popular"
                    </label>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-check form-switch">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      name="availabilityStatus" 
                      id="availabilityStatus"
                      checked={itemForm.availabilityStatus}
                      onChange={handleItemFormChange}
                    />
                    <label className="form-check-label text-white ms-2" htmlFor="availabilityStatus">
                      In Stock / Available
                    </label>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-check form-switch">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      name="showPriceToggle" 
                      id="showPriceToggle"
                      checked={itemForm.showPriceToggle}
                      onChange={handleItemFormChange}
                    />
                    <label className="form-check-label text-white ms-2" htmlFor="showPriceToggle">
                      Show Individual Price
                    </label>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-luxury px-5 py-3" disabled={submitting}>
                  {submitting ? 'Saving Dish...' : 'Save Menu Item'}
                </button>
                <button type="button" className="btn btn-luxury-outline px-4 py-3" onClick={() => setItemFormView('list')}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </>
      )}

      {/* 4. Sub-Tab Content: Categories */}
      {activeSubTab === 'categories' && (
        <>
          {categoryFormView === 'list' ? (
            <>
              <div className="d-flex justify-content-between mb-4">
                <h5 className="font-serif fw-bold text-white mb-0">Menu Categories</h5>
                <button className="btn btn-luxury py-2" onClick={() => { setCategoryName(''); setCategoryFormView('add'); }}>
                  <i className="bi bi-plus-lg me-1"></i> New Category
                </button>
              </div>

              {loading ? (
                <div className="text-center p-5"><div className="spinner-border spinner-luxury" /></div>
              ) : (
                <div className="row g-3">
                  {categories.map(cat => (
                    <div className="col-md-4" key={cat._id}>
                      <div className="card-luxury p-3 d-flex flex-column justify-content-between" style={{ height: '140px' }}>
                        <div>
                          <h5 className="font-serif fw-bold text-white mb-1">{cat.name}</h5>
                          <span className="text-muted small">Slug: <code>{cat.slug}</code></span>
                        </div>
                        <div className="d-flex justify-content-end gap-2 border-top pt-2" style={{ borderColor: 'var(--border-color)' }}>
                          <button className="btn btn-sm btn-luxury-outline border-0 py-1 px-2" onClick={() => startEditCategory(cat)}>
                            <i className="bi bi-pencil"></i> Rename
                          </button>
                          <button className="btn btn-sm btn-outline-danger border-0 py-1 px-2" onClick={() => handleDeleteCategory(cat._id, cat.name)}>
                            <i className="bi bi-trash"></i> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <div className="col-12 text-center py-5 text-secondary">
                      No categories created yet. Click "New Category" to begin.
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            // Add/Edit Form for Category
            <form onSubmit={selectedCategoryId ? handleUpdateCategory : handleCreateCategory} className="p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px', maxWidth: '600px' }}>
              <h5 className="font-serif fw-bold text-white mb-4 border-bottom pb-2" style={{ borderColor: 'var(--border-color)', color: 'var(--color-gold) !important' }}>
                {categoryFormView === 'add' ? 'Create New Food Category' : 'Rename Category'}
              </h5>

              <div className="mb-4">
                <label className="form-label-luxury">Category Name *</label>
                <input 
                  type="text" 
                  className="form-control form-luxury" 
                  value={categoryName} 
                  onChange={e => setCategoryName(e.target.value)} 
                  placeholder="e.g. Traditional Lunch"
                  required 
                />
                <div className="small text-secondary mt-1">Special characters will be converted into URL-friendly slug. Name must be unique.</div>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-luxury px-4 py-2.5" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Category'}
                </button>
                <button type="button" className="btn btn-luxury-outline px-4 py-2.5" onClick={() => setCategoryFormView('list')}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default CmsRestaurantMenu;

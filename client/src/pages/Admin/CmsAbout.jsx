import React, { useState, useEffect } from 'react';
import api, { getAPIImageUrl } from '../../services/api';

const CmsAbout = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // About Texts
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [storyTitle, setStoryTitle] = useState('');
  const [storyDescription, setStoryDescription] = useState('');
  
  // Images
  const [image, setImage] = useState('');
  const [storyImage, setStoryImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [storyImageFile, setStoryImageFile] = useState(null);

  // Family State
  const [family, setFamily] = useState([]);
  const [familyView, setFamilyView] = useState('list'); // 'list', 'add', 'edit'
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [memberForm, setMemberForm] = useState({
    name: '',
    role: '',
    description: '',
    order: 0
  });
  const [memberImageFile, setMemberImageFile] = useState(null);
  const [existingMemberImage, setExistingMemberImage] = useState('');
  const [savingMember, setSavingMember] = useState(false);

  const fetchAboutData = async () => {
    try {
      const res = await api.get('/about');
      if (res.success) {
        setTitle(res.about?.title || '');
        setSubtitle(res.about?.subtitle || '');
        setDescription(res.about?.description || '');
        setStoryTitle(res.about?.storyTitle || '');
        setStoryDescription(res.about?.storyDescription || '');
        setImage(res.about?.image || '');
        setStoryImage(res.about?.storyImage || '');
        setFamily(res.family || []);
      }
    } catch (err) {
      console.error('Error fetching about data:', err);
      setMsg({ type: 'danger', text: 'Error fetching About page contents.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  const handleUpdateAbout = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: '', text: '' });

    const formData = new FormData();
    formData.append('title', title);
    formData.append('subtitle', subtitle);
    formData.append('description', description);
    formData.append('storyTitle', storyTitle);
    formData.append('storyDescription', storyDescription);

    if (imageFile) formData.append('image', imageFile);
    if (storyImageFile) formData.append('storyImage', storyImageFile);

    try {
      const res = await api.put('/about', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.success) {
        setMsg({ type: 'success', text: 'About page texts and images updated successfully!' });
        setImageFile(null);
        setStoryImageFile(null);
        if (res.data) {
          setImage(res.data.image || '');
          setStoryImage(res.data.storyImage || '');
        }
      }
    } catch (err) {
      setMsg({ type: 'danger', text: typeof err === 'string' ? err : 'Error updating About content.' });
    } finally {
      setSaving(false);
    }
  };

  // --- Family Handlers ---
  const handleMemberFormChange = (e) => {
    const { name, value } = e.target;
    setMemberForm(prev => ({ ...prev, [name]: value }));
  };

  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    if (!memberForm.name.trim() || !memberForm.role.trim()) {
      setMsg({ type: 'danger', text: 'Name and Role are required.' });
      return;
    }

    setSavingMember(true);
    setMsg({ type: '', text: '' });

    const formData = new FormData();
    formData.append('name', memberForm.name);
    formData.append('role', memberForm.role);
    formData.append('description', memberForm.description);
    formData.append('order', memberForm.order);
    if (memberImageFile) {
      formData.append('image', memberImageFile);
    }

    try {
      let res;
      if (familyView === 'add') {
        res = await api.post('/about/family', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await api.put(`/about/family/${selectedMemberId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (res.success) {
        setMsg({ type: 'success', text: `Family member ${familyView === 'add' ? 'added' : 'updated'} successfully.` });
        resetMemberForm();
        setFamilyView('list');
        fetchAboutData();
      }
    } catch (err) {
      setMsg({ type: 'danger', text: typeof err === 'string' ? err : 'Error saving family member.' });
    } finally {
      setSavingMember(false);
    }
  };

  const handleDeleteMember = async (id, name) => {
    if (!window.confirm(`Delete family member "${name}" permanently?`)) return;
    setMsg({ type: '', text: '' });

    try {
      const res = await api.delete(`/about/family/${id}`);
      if (res.success) {
        setMsg({ type: 'success', text: 'Family member deleted successfully.' });
        fetchAboutData();
      }
    } catch (err) {
      setMsg({ type: 'danger', text: typeof err === 'string' ? err : 'Delete failed.' });
    }
  };

  const startEditMember = (m) => {
    setSelectedMemberId(m._id);
    setMemberForm({
      name: m.name,
      role: m.role,
      description: m.description || '',
      order: m.order || 0
    });
    setExistingMemberImage(m.image);
    setMemberImageFile(null);
    setFamilyView('edit');
  };

  const resetMemberForm = () => {
    setMemberForm({
      name: '',
      role: '',
      description: '',
      order: 0
    });
    setMemberImageFile(null);
    setExistingMemberImage('');
    setSelectedMemberId(null);
  };


  if (loading) {
    return <div className="text-center p-5 text-secondary"><div className="spinner-border spinner-luxury" /></div>;
  }

  return (
    <div className="fade-in-up text-white">
      <div className="mb-4">
        <h3 className="font-serif fw-bold m-0">About Page & Family CMS</h3>
        <p className="text-secondary small m-0">Manage About page banners, coordinates, legacy statements, and custom profiles for the host family.</p>
      </div>

      {msg.text && <div className={`alert alert-${msg.type} rounded-0 py-2 mb-4`}>{msg.text}</div>}

      <div className="row g-4">
        {/* Left Side: General About Form */}
        <div className="col-lg-7 col-12">
          <form onSubmit={handleUpdateAbout} className="p-4 d-flex flex-column gap-3" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
            <h5 className="font-serif fw-bold text-white border-bottom pb-2" style={{ borderColor: 'var(--border-color)', color: 'var(--color-gold) !important' }}>
              General About Us Details
            </h5>

            <div className="row g-3">
              <div className="col-md-6 col-12">
                <label className="form-label-luxury">Main Title *</label>
                <input type="text" className="form-control form-luxury" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>
              <div className="col-md-6 col-12">
                <label className="form-label-luxury">Subtitle *</label>
                <input type="text" className="form-control form-luxury" value={subtitle} onChange={e => setSubtitle(e.target.value)} required />
              </div>

              <div className="col-12">
                <label className="form-label-luxury">Main Description *</label>
                <textarea className="form-control form-luxury" rows="3" value={description} onChange={e => setDescription(e.target.value)} required></textarea>
              </div>

              <div className="col-md-6 col-12">
                <label className="form-label-luxury">Upload Main Image</label>
                <input type="file" className="form-control form-luxury mb-2" onChange={e => setImageFile(e.target.files[0])} accept="image/*" />
                {imageFile && (
                  <div className="mb-2" style={{ maxWidth: '100%', maxHeight: '100px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <img src={URL.createObjectURL(imageFile)} alt="Main Preview" style={{ width: '100px', height: 'auto' }} />
                  </div>
                )}
                {image && !imageFile && (
                  <img src={getAPIImageUrl(image)} alt="Main" style={{ width: '100px', height: '60px', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                )}
              </div>

              <div className="col-12 border-top pt-3 mt-4" style={{ borderColor: 'var(--border-color)' }}>
                <h6 className="font-serif fw-bold text-gold mb-3">Legacy & Philosophy Section</h6>
              </div>

              <div className="col-12">
                <label className="form-label-luxury">Story Section Title *</label>
                <input type="text" className="form-control form-luxury" value={storyTitle} onChange={e => setStoryTitle(e.target.value)} required />
              </div>

              <div className="col-12">
                <label className="form-label-luxury">Story Section Description *</label>
                <textarea className="form-control form-luxury" rows="4" value={storyDescription} onChange={e => setStoryDescription(e.target.value)} required></textarea>
              </div>

              <div className="col-md-6 col-12">
                <label className="form-label-luxury">Upload Story Image</label>
                <input type="file" className="form-control form-luxury mb-2" onChange={e => setStoryImageFile(e.target.files[0])} accept="image/*" />
                {storyImageFile && (
                  <div className="mb-2" style={{ maxWidth: '100%', maxHeight: '100px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <img src={URL.createObjectURL(storyImageFile)} alt="Story Preview" style={{ width: '100px', height: 'auto' }} />
                  </div>
                )}
                {storyImage && !storyImageFile && (
                  <img src={getAPIImageUrl(storyImage)} alt="Story" style={{ width: '100px', height: '60px', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                )}
              </div>
            </div>

            <button type="submit" className="btn btn-luxury px-4 py-3 mt-2 align-self-start" disabled={saving}>
              {saving ? 'Saving Content...' : 'Save About Us Page'}
            </button>
          </form>
        </div>

        {/* Right Side: Family Members CRUD */}
        <div className="col-lg-5 col-12">
          {familyView === 'list' ? (
            <div className="p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
              <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2" style={{ borderColor: 'var(--border-color)' }}>
                <h5 className="font-serif fw-bold text-white m-0" style={{ color: 'var(--color-gold) !important' }}>Host Family Profiles</h5>
                <button className="btn btn-sm btn-luxury" onClick={() => { resetMemberForm(); setFamilyView('add'); }}>
                  <i className="bi bi-plus-lg me-1"></i> Add Member
                </button>
              </div>

              <div className="d-flex flex-column gap-3">
                {family.map((member) => (
                  <div key={member._id} className="p-3 border d-flex align-items-center justify-content-between" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-primary)', borderRadius: '4px' }}>
                    <div className="d-flex align-items-center gap-3">
                      <img 
                        src={getAPIImageUrl(member.image) || 'https://img.icons8.com/office/40/user.png'} 
                        alt={member.name} 
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%', border: '1px solid var(--border-color)' }} 
                      />
                      <div>
                        <h6 className="fw-bold mb-0 text-white">{member.name}</h6>
                        <span className="small text-gold text-uppercase" style={{ fontSize: '0.65rem' }}>{member.role}</span>
                        {member.order > 0 && <span className="badge bg-secondary ms-2 small" style={{ fontSize: '0.55rem' }}>Priority {member.order}</span>}
                      </div>
                    </div>

                    <div className="d-flex gap-1">
                      <button className="btn btn-sm btn-outline-light border-0 p-1 me-1" onClick={() => startEditMember(member)}>
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger border-0 p-1" onClick={() => handleDeleteMember(member._id, member.name)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
                {family.length === 0 && (
                  <div className="text-secondary small italic text-center py-4">No family members registered. Click "Add Member" to begin.</div>
                )}
              </div>
            </div>
          ) : (
            // Add/Edit Member Form
            <form onSubmit={handleMemberSubmit} className="p-4 d-flex flex-column gap-3" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
              <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2" style={{ borderColor: 'var(--border-color)' }}>
                <h5 className="font-serif fw-bold text-white m-0" style={{ color: 'var(--color-gold) !important' }}>
                  {familyView === 'add' ? 'Add New Family Member' : 'Edit Family Member'}
                </h5>
                <button type="button" className="btn btn-sm btn-luxury-outline" onClick={() => setFamilyView('list')}>
                  Cancel
                </button>
              </div>

              <div>
                <label className="form-label-luxury">Full Name *</label>
                <input type="text" name="name" className="form-control form-luxury" value={memberForm.name} onChange={handleMemberFormChange} required />
              </div>

              <div>
                <label className="form-label-luxury">Role / Title *</label>
                <input type="text" name="role" className="form-control form-luxury" placeholder="e.g. Lodge Host, Head Chef" value={memberForm.role} onChange={handleMemberFormChange} required />
              </div>

              <div>
                <label className="form-label-luxury">Short Bio / Description</label>
                <textarea name="description" className="form-control form-luxury" rows="3" placeholder="Maya cooks delicious Sel Roti..." value={memberForm.description} onChange={handleMemberFormChange}></textarea>
              </div>

              <div>
                <label className="form-label-luxury">Sorting Order Priority</label>
                <input type="number" name="order" className="form-control form-luxury" placeholder="0" value={memberForm.order} onChange={handleMemberFormChange} />
              </div>

              <div>
                <label className="form-label-luxury">Photo Upload</label>
                <input type="file" className="form-control form-luxury mb-2" onChange={e => setMemberImageFile(e.target.files[0])} accept="image/*" />
                
                {memberImageFile && (
                  <div className="mt-2" style={{ maxWidth: '100px', maxHeight: '100px', overflow: 'hidden', border: '1px solid var(--border-color)', borderRadius: '50%' }}>
                    <img src={URL.createObjectURL(memberImageFile)} alt="Member Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                  </div>
                )}

                {familyView === 'edit' && existingMemberImage && !memberImageFile && (
                  <img src={getAPIImageUrl(existingMemberImage)} alt="Current" style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '50%', border: '1px solid var(--border-color)' }} />
                )}
              </div>

              <button type="submit" className="btn btn-luxury px-4 py-2.5 mt-2" disabled={savingMember}>
                {savingMember ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CmsAbout;

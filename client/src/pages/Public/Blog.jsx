import React, { useState, useEffect } from 'react';
import api, { getAPIImageUrl } from '../../services/api';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [readingArticle, setReadingArticle] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/blogs?publishedOnly=true');
        if (res.success) {
          setBlogs(res.data);
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);


  // Get unique categories
  const categories = ['All', ...new Set(blogs.map(b => b.category))];

  // Filtering
  const filteredBlogs = blogs.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
      {readingArticle ? (
        // Detailed Article View
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <button 
            className="btn btn-sm btn-blue-outline mb-4" 
            onClick={() => setReadingArticle(null)}
          >
            <i className="bi bi-arrow-left me-2"></i> Back to Journals
          </button>
          
          <img 
            src={getAPIImageUrl(readingArticle.thumbnail)} 
            alt={readingArticle.title} 
            className="img-fluid w-100 mb-4"
            style={{ height: '360px', objectFit: 'cover', border: '1px solid var(--border-color)', borderRadius: '4px' }}
          />

          <span className="badge rounded-0 bg-transparent text-secondary border px-2 py-1 mb-2" style={{ fontSize: '0.75rem', borderColor: 'var(--border-color)' }}>
            {readingArticle.category}
          </span>
          
          <h1 className="font-serif display-5 fw-bold mb-3">{readingArticle.title}</h1>
          <div className="d-flex gap-3 text-secondary small border-bottom pb-3 mb-4" style={{ borderColor: 'var(--border-color)' }}>
            <span>By {readingArticle.author}</span>
            <span>&bull;</span>
            <span>{new Date(readingArticle.createdAt).toLocaleDateString()}</span>
          </div>

          <div 
            className="lh-lg blog-body-content text-secondary"
            dangerouslySetInnerHTML={{ __html: readingArticle.content }}
          ></div>
        </div>
      ) : (
        // Listing Grid View
        <>
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-8 col-11">
              <h6 className="text-uppercase fw-semibold" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em', fontSize: '0.75rem' }}>
                Blog
              </h6>
              <h1 className="display-4 font-serif fw-bold my-2">Retreat Journals</h1>
              <div className="gold-accent-line"></div>
              <p className="lead text-secondary" style={{ fontSize: '1rem' }}>
                Read about design principles, Himalayan wellness practices, and itineraries for exploring Pokhara.
              </p>
            </div>
          </div>

          {/* Search and Category Tabs */}
          <div className="row g-3 justify-content-between align-items-center mb-5">
            <div className="col-md-5">
              <input 
                type="text" 
                className="form-control form-luxury" 
                placeholder="Search articles..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="col-md-7 d-flex justify-content-md-end flex-wrap gap-1">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn btn-sm px-3 py-1 border-0 rounded-0 text-uppercase small ${selectedCategory === cat ? 'btn-blue' : 'btn-blue-outline'}`}
                  style={{ fontSize: '0.7rem', letterSpacing: '0.05rem' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of articles */}
          <div className="row g-4">
            {filteredBlogs.map(post => (
              <div className="col-lg-6" key={post._id}>
                <div className="card-luxury h-100 d-flex flex-column flex-md-row">
                  <div style={{ minWidth: '200px', height: '200px', overflow: 'hidden' }} className="w-100 w-md-200">
                    <img 
                      src={getAPIImageUrl(post.thumbnail)} 
                      className="w-100 h-100" 
                      style={{ objectFit: 'cover' }} 
                      alt={post.title}
                    />
                  </div>
                  <div className="p-4 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="small text-uppercase fw-semibold" style={{ color: 'var(--color-gold)' }}>{post.category}</span>
                        <span className="small text-secondary">{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-serif fw-bold fs-5 mb-2">{post.title}</h4>
                      <p className="small text-secondary lh-lg mb-3">{post.summary}</p>
                    </div>
                    <button 
                      onClick={() => setReadingArticle(post)}
                      className="btn btn-sm btn-blue-outline align-self-start py-1 px-3"
                      style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
                    >
                      Read Article
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredBlogs.length === 0 && (
              <div className="col-12 text-center my-5">
                <h5 className="font-serif text-secondary">No articles matches your query.</h5>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Blog;

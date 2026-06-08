import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useState(() => {
    if (localStorage.getItem('adminToken')) {
      navigate('/admin/dashboard');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { username, password });
      if (res.success && res.token) {
        localStorage.setItem('adminToken', res.token);
        localStorage.setItem('adminUser', JSON.stringify(res.admin));
        navigate('/admin/dashboard');
      } else {
        setError('Authentication failed.');
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '85vh', backgroundColor: 'var(--bg-primary)' }}>
      <div className="p-5" style={{ width: '100%', maxWidth: '420px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <div className="text-center mb-4">
          <img 
            src={`${import.meta.env.BASE_URL}logo.png`} 
            alt="New Pittam Deurali Logo" 
            style={{ height: '75px', width: 'auto', objectFit: 'contain', marginBottom: '16px' }} 
          />
          <h2 className="font-serif fw-bold" style={{ color: 'var(--color-gold)' }}>Deurali Guest House</h2>
          <span className="small text-secondary text-uppercase tracking-wider">Property Administrator Panel</span>
        </div>

        {error && <div className="alert alert-danger rounded-0 small py-2">{error}</div>}

        <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
          <div>
            <label className="form-label-luxury">Username</label>
            <input 
              type="text" 
              className="form-control form-luxury" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              required 
            />
          </div>

          <div>
            <label className="form-label-luxury">Password</label>
            <input 
              type="password" 
              className="form-control form-luxury" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-luxury w-100 mt-2 py-3"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

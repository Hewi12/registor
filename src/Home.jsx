import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const response = await axios.get('');
        if (response.data.authenticated) {
          setUser(response.data.user);
        } else {
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setError('Failed to verify authentication status');
        navigate('/login', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await axios.post('http://localhost:3001/logout', {}, {
        withCredentials: true
      });
      setUser(null);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Failed to logout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid vh-100 bg-light">
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <span className="navbar-brand fw-bold">
            {user ? `Welcome, ${user.name}` : 'Welcome'}
          </span>
          <button 
            className="btn btn-outline-danger"
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            Logout
          </button>
        </div>
      </nav>

      <div className="container mt-5">
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setError('')}
              aria-label="Close"
            ></button>
          </div>
        )}
        
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold">Welcome to Your Dashboard</h2>
                  <p className="text-muted">You're successfully logged in!</p>
                </div>

                {user ? (
                  <div className="row">
                    <div className="col-md-6">
                      <div className="card mb-3">
                        <div className="card-body">
                          <h5 className="card-title">Your Profile</h5>
                          <p className="card-text">
                            <strong>Name:</strong> {user.name}<br />
                            <strong>Email:</strong> {user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card mb-3">
                        <div className="card-body">
                          <h5 className="card-title">Account Status</h5>
                          <p className="card-text">
                            <span className="badge bg-success">Active</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="alert alert-warning">
                    User information not available. Please try logging in again.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
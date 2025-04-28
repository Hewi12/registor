import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaGoogle, FaFacebookF, FaTwitter } from 'react-icons/fa';
import './LoginGlass.css';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/register', { name, email, password });
      if (response.data.message === 'User registered successfully') {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="login-bg">
      <div className="glass-card">
        <h2 className="login-title">SIGN UP</h2>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            className="login-input"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            className="login-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="login-input"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-btn">Sign Up</button>
        </form>
        <div className="or-divider">OR</div>
        <div className="social-row">
          <button className="social-btn google"><FaGoogle /></button>
          <button className="social-btn facebook"><FaFacebookF /></button>
          <button className="social-btn twitter"><FaTwitter /></button>
        </div>
        <div className="text-center mt-3">
          <span>Already have an account? </span>
          <button 
            type="button"
            onClick={() => navigate('/login')} 
            className="btn btn-link text-decoration-none p-0"
            style={{ color: '#6c63ff', fontWeight: 'bold' }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;

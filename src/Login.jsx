import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaGoogle, FaFacebookF, FaTwitter } from 'react-icons/fa';
import './LoginGlass.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/login', { email, password });
      if (response.data.isAuthenticated) {
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-bg">
      <div className="glass-card">
        <h2 className="login-title">LOGIN</h2>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            className="login-input"
            placeholder="Email or username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="login-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="login-row">
            <span></span>
            <span className="forgot-link" onClick={() => navigate('/forgot-password')}>Forgot password?</span>
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
        <div className="or-divider">OR</div>
        <div className="social-row">
          <button className="social-btn google"><FaGoogle /></button>
          <button className="social-btn facebook"><FaFacebookF /></button>
          <button className="social-btn twitter"><FaTwitter /></button>
        </div>
        <div className="text-center mt-3">
          <span>Don't have an account? </span>
          <Link
            to="/register"
            className="btn btn-link text-decoration-none p-0"
            style={{ color: '#6c63ff', fontWeight: 'bold' }}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

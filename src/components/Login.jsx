import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      localStorage.setItem('token', response.data.token);
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  const loginAsAdmin = () => {
    setEmail('admin@abc.com');
    setPassword('password');
  };

  const loginAsEmployee = () => {
    setEmail('employee1@abc.com');
    setPassword('password');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🐾 Dog Training Task Manager</h1>
          <p>Login to access your tasks</p>
        </div>

        <div className="test-buttons">
          <button onClick={loginAsAdmin} className="test-btn admin" type="button">
            🚀 Test: Login as Admin
          </button>
          <button onClick={loginAsEmployee} className="test-btn employee" type="button">
            👤 Test: Login as Employee
          </button>
        </div>

        <div className="divider">
          <span>OR</span>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <button type="submit" disabled={loading} className="login-btn">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="credentials-info">
          <details>
            <summary>📋 Available Test Accounts</summary>
            <p><strong>Admin:</strong> admin@abc.com / password</p>
            <p><strong>Employee:</strong> employee1@abc.com / password</p>
          </details>
        </div>
      </div>
    </div>
  );
};

export default Login;
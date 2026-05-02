import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

function Signup({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/createuser/', null, {
        params: {
          username,
          password,
          email,
        }
      });

      if (response.data.data === false) {
        setError('Failed to create account');
      } else {
        const u = response.data.data;
        localStorage.setItem('userData', JSON.stringify(u));
        try {
          const id = Array.isArray(u) ? u[0]?.id ?? u[0]?.user_id : u?.id ?? u?.user_id;
          if (id) localStorage.setItem('userId', id);
        } catch (_) {}
        setIsLoggedIn(true);
        navigate('/');
      }
    } catch (err) {
      setError('Failed to create account');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-form">
        <h2>Sign Up</h2>
        <p className="info-text">Create an account to start renting cars</p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
            />
          </div>
          <button type="submit" className="submit-btn">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;

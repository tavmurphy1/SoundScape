import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../LoginPage.css';

const USER_AUTH_URL = process.env.REACT_APP_USER_AUTH_URL || 'http://localhost:3002';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  async function handleLogin() {
    console.log(`Attempting login to ${USER_AUTH_URL}/users/login`);

    try {
      const response = await fetch(`${USER_AUTH_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login API response:', data);

      if (!response.ok) {
        setMessage(data.message || 'Login failed');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setMessage('Login successful!');
      navigate('/concerts');
    } catch (error) {
      console.error('Login error:', error);
      setMessage('An error occurred while logging in.');
    }
  }

  function goToCreateAccount() {
    navigate('/create-account');
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">
          Welcome to <br />
          SoundScape!
        </h1>
        <p className="login-tagline">
          Find the best concerts.
          <br />
          Secure your tickets fast.
          <br />
          Never miss a show again.
        </p>

        <div className="input-container">
          <input
            className="login-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-container">
          <input
            className="login-input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-button" onClick={handleLogin}>
          Login
        </button>

        <p className="or-text">Or</p>

        <button className="signup-button" onClick={goToCreateAccount}>
          Get Started — it's Free!
        </button>

        {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
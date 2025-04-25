/* 
 * Author: Tavner Murphy
 * Date: 2/10/2024
 * React Starter App - Bootstrapped with Create React App
 * 
 * Source: Facebook, Inc. (2024). React Starter App. Retrieved from https://react.dev
 * 
 * This project was initialized using Create React App.
 * See documentation at https://create-react-app.dev
*/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CreateAccountPage.css';

function CreateAccountPage() {
  const [name, setName] = useState('');
  const [homeCity, setHomeCity] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // Favorites array
  const [favorites, setFavorites] = useState(['', '', '', '']);

  // Update a specific favorite artist at the given index
  function updateFavorite(index, value) {
    const updatedFavorites = [...favorites];
    updatedFavorites[index] = value;
    setFavorites(updatedFavorites);
  }

  async function handleCreateAccount() {
    if (!name || !homeCity || !email || !password) {
      alert("Error: Complete all fields to create account");
      return;
    }

    const newUser = { name, homeCity, email, password };

    try {
      const response = await fetch('/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      const data = await response.json();

      if (data.message && data.token) {
        // Save the JWT token in localStorage
        localStorage.setItem('jwtToken', data.token);

        // FAVORTIES SECTION
        const userID = data.user._id;
        for (const artistName of favorites) {
          // Only send if the artist field is not empty.
          if (artistName.trim() !== '') {
            try {
              await fetch('/favorites', {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${data.token}`
                },
                body: JSON.stringify({ userID, artist: artistName })
              });
            } catch (favError) {
              console.error('Error adding favorite:', favError);
            }
          }
        }

        navigate('/concerts');
      } else if (data.error) {
        setErrorMsg(data.error);
      }
    } catch (err) {
      console.error('Error:', err);
      setErrorMsg('An error occurred while creating your account.');
    }
  }

  function goHome() {
    navigate('/');
  }

  return (
    <div className="create-container">
      <button className="home-button" onClick={goHome}>Home</button>
      <h1 className="create-title">Account Creation</h1>
      <p className="create-subtitle">
        Enter your information below, then click "Create Account" to begin
        seeing concerts in your home city!
      </p>
      {errorMsg && <p className="error">{errorMsg}</p>}

      {/* Account Details */}
      <div className="input-wrapper">
        <input
          className="create-input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="input-wrapper">
        <input
          className="create-input"
          placeholder="Home City"
          value={homeCity}
          onChange={(e) => setHomeCity(e.target.value)}
        />
      </div>
      <div className="input-wrapper">
        <input
          className="create-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="input-wrapper">
        <input
          className="create-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Favorites Section */}
      <div className="favorites-section">
        <h2>Your Favorite Artists (up to 4)</h2>
        {favorites.map((fav, index) => (
          <div key={index} className="favorite-inputs">
            <input
              className="create-input favorite-artist"
              placeholder="Favorite Artist Name"
              value={fav}
              onChange={(e) => updateFavorite(index, e.target.value)}
            />
          </div>
        ))}
      </div>

      <button className="create-button" onClick={handleCreateAccount}>
        Create Account
      </button>
    </div>
  );
}

export default CreateAccountPage;
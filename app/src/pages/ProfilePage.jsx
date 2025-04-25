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

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../ProfilePage.css';

const USER_AUTH_URL    = process.env.REACT_APP_USER_AUTH_URL   || 'http://localhost:3002';
const CONCERTLOG_URL   = process.env.REACT_APP_CONCERTLOG_URL  || 'http://localhost:3001';
const FAVORITES_URL    = process.env.REACT_APP_FAVORITES_URL   || 'http://localhost:3004';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editingField, setEditingField] = useState('');
  const [tempValue, setTempValue] = useState('');
  const [error, setError] = useState('');

  const [loggedConcerts, setLoggedConcerts] = useState([]);
  const [showConcertPopup, setShowConcertPopup] = useState(false);
  const [newConcert, setNewConcert] = useState({
    artist: '',
    venue: '',
    dateAttended: '',
    notes: '',
    rating: 0,
  });

  const [favorites, setFavorites] = useState([]);
  const [showFavoritesPopup, setShowFavoritesPopup] = useState(false);
  const [tempFavorites, setTempFavorites] = useState(['', '', '', '']);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserProfile() {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await fetch(`${USER_AUTH_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unauthorized');
        setUser(data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Unable to fetch user profile.');
        navigate('/login');
      }
    }
    fetchUserProfile();
  }, [navigate]);

  useEffect(() => {
    if (user && user._id) {
      fetchConcerts(user._id);
      fetchFavorites();
    }
  }, [user]);

  async function fetchConcerts(userId) {
    try {
      const response = await fetch(
        `${CONCERTLOG_URL}/concertlog?userID=${userId}`
      );
      if (response.ok) {
        const concerts = await response.json();
        setLoggedConcerts(concerts);
      } else {
        console.error('Error fetching concerts:', response.status);
      }
    } catch (err) {
      console.error('Error fetching concerts:', err);
    }
  }

  async function fetchFavorites() {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${FAVORITES_URL}/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const favs = await response.json();
        setFavorites(favs);
        const namesOnly = favs.map((f) => f.artist).slice(0, 4);
        while (namesOnly.length < 4) namesOnly.push('');
        setTempFavorites(namesOnly);
      } else {
        console.error('Error fetching favorites:', response.status);
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  }

  function handleEdit(fieldName) {
    setEditingField(fieldName);
    setTempValue(user[fieldName] || '');
  }

  async function handleSave(fieldName) {
    const token = localStorage.getItem('token');
    const updatedField = { [fieldName]: tempValue };
    try {
      const response = await fetch(`${USER_AUTH_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedField),
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setEditingField('');
        setTempValue('');
      } else {
        alert(data.error || 'Failed to update profile.');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('An error occurred while updating your profile.');
    }
  }

  function handleCancel() {
    setEditingField('');
    setTempValue('');
  }

  function openFavoritesPopup() {
    setShowFavoritesPopup(true);
  }
  function closeFavoritesPopup() {
    setShowFavoritesPopup(false);
  }

  async function handleSaveFavorites(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Not logged in');
      return;
    }

    try {
      // DELETE existing favorites
      for (const fav of favorites) {
        const delRes = await fetch(
          `${FAVORITES_URL}/favorites/${fav._id}`,
          {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!delRes.ok) {
          console.error(
            'DELETE failed',
            fav._id,
            delRes.status,
            await delRes.text()
          );
        }
      }

      // POST new favorites
      for (const artistName of tempFavorites) {
        if (artistName.trim()) {
          const postRes = await fetch(`${FAVORITES_URL}/favorites`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ artist: artistName }),
          });
          if (!postRes.ok) {
            console.error(
              'POST failed',
              artistName,
              postRes.status,
              await postRes.text()
            );
          }
        }
      }

      await fetchFavorites();
      closeFavoritesPopup();
    } catch (err) {
      console.error('Error saving favorites:', err);
      alert(`Error saving favorites: ${err.message}`);
    }
  }

  function openConcertPopup() {
    setShowConcertPopup(true);
  }
  function closeConcertPopup() {
    setShowConcertPopup(false);
    setNewConcert({
      artist: '',
      venue: '',
      dateAttended: '',
      notes: '',
      rating: 0,
    });
  }

  async function handleConcertSave(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!user || !user._id) return;

    const concertData = { userID: user._id, ...newConcert };
    try {
      const response = await fetch(`${CONCERTLOG_URL}/concertlog`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(concertData),
      });
      if (response.ok) {
        fetchConcerts(user._id);
        closeConcertPopup();
      } else {
        const errText = await response.text();
        console.error('Error saving concert data:', errText);
        alert('Error saving concert data');
      }
    } catch (err) {
      console.error('Error saving concert data:', err);
      alert('Error saving concert data');
    }
  }

  if (!user) {
    return (
      <div className="profile-container">
        <NavBar />
        <p>Loading user profile...</p>
        {error && <p className="profile-error">{error}</p>}
      </div>
    );
  }

  return (
    <div className="profile-container">
      <NavBar />
      <div className="profile-content">
        <h1 className="profile-title">Your Profile</h1>
        {error && <p className="profile-error">{error}</p>}

        <FavoritesSection
          favorites={favorites}
          openFavoritesPopup={openFavoritesPopup}
        />

        {showFavoritesPopup && (
          <FavoritesPopup
            tempFavorites={tempFavorites}
            setTempFavorites={setTempFavorites}
            handleSaveFavorites={handleSaveFavorites}
            closeFavoritesPopup={closeFavoritesPopup}
          />
        )}

        <ProfileRow
          label="Name"
          value={user.name}
          fieldName="name"
          editingField={editingField}
          tempValue={tempValue}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          setTempValue={setTempValue}
        />

        <ProfileRow
          label="Home City"
          value={user.homeCity}
          fieldName="homeCity"
          editingField={editingField}
          tempValue={tempValue}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          setTempValue={setTempValue}
        />

        <ProfileRow
          label="Email"
          value={user.email}
          fieldName="email"
          editingField={editingField}
          tempValue={tempValue}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          setTempValue={setTempValue}
        />

        {loggedConcerts.length > 0 && (
          <div className="logged-concerts">
            <h2>Logged Concerts</h2>
            <ul>
              {loggedConcerts.map((concert) => (
                <li key={concert._id}>
                  <strong>{concert.artist}</strong> at {concert.venue} on{' '}
                  {new Date(concert.dateAttended).toLocaleDateString()} | Rating:{' '}
                  {concert.rating} | Notes: {concert.notes}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          className="log-concert-button"
          onClick={openConcertPopup}
        >
          Log Concert
        </button>

        {showConcertPopup && (
          <ConcertPopup
            newConcert={newConcert}
            setNewConcert={setNewConcert}
            handleConcertSave={handleConcertSave}
            closeConcertPopup={closeConcertPopup}
          />
        )}
      </div>
    </div>
  );
}

// Mini-components:

function FavoritesSection({ favorites, openFavoritesPopup }) {
  return (
    <div className="favorites-section">
      <h2>Favorite Artists</h2>
      {favorites.length > 0 ? (
        <div className="favorites-grid">
          {favorites.map((fav) => (
            <div key={fav._id} className="favorite-item">
              <img
                src={fav.photoUrl || 'https://via.placeholder.com/150'}
                alt={fav.artist}
                className="favorite-artist-image"
              />
              <p>{fav.artist}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No favorite artists yet.</p>
      )}
      <button
        className="edit-favorites-button"
        onClick={openFavoritesPopup}
      >
        Edit Favorites
      </button>
    </div>
  );
}

function FavoritesPopup({
  tempFavorites,
  setTempFavorites,
  handleSaveFavorites,
  closeFavoritesPopup,
}) {
  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>Edit Favorites</h2>
        <form onSubmit={handleSaveFavorites}>
          {tempFavorites.map((artistName, index) => (
            <div key={index} className="favorite-edit-row">
              <label>Artist {index + 1}:</label>
              <input
                type="text"
                value={artistName}
                onChange={(e) => {
                  const newArray = [...tempFavorites];
                  newArray[index] = e.target.value;
                  setTempFavorites(newArray);
                }}
              />
            </div>
          ))}
          <div className="popup-buttons">
            <button type="submit">Save Favorites</button>
            <button type="button" onClick={closeFavoritesPopup}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProfileRow({
  label,
  value,
  fieldName,
  editingField,
  tempValue,
  onEdit,
  onSave,
  onCancel,
  setTempValue,
}) {
  const isEditing = editingField === fieldName;
  return (
    <div className="profile-row">
      <span className="profile-label">{label}</span>
      {isEditing ? (
        <>
          <input
            className="profile-input"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
          />
          <button
            className="profile-save"
            onClick={() => onSave(fieldName)}
          >
            Save
          </button>
          <button
            className="profile-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <span className="profile-value">{value}</span>
          <button
            className="profile-edit-btn"
            onClick={() => onEdit(fieldName)}
          >
            ✏️
          </button>
        </>
      )}
    </div>
  );
}

function ConcertPopup({
  newConcert,
  setNewConcert,
  handleConcertSave,
  closeConcertPopup,
}) {
  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>Log a Concert</h2>
        <form onSubmit={handleConcertSave}>
          <label>
            Artist:
            <input
              type="text"
              value={newConcert.artist}
              onChange={(e) =>
                setNewConcert({ ...newConcert, artist: e.target.value })
              }
              required
            />
          </label>
          <label>
            Venue:
            <input
              type="text"
              value={newConcert.venue}
              onChange={(e) =>
                setNewConcert({ ...newConcert, venue: e.target.value })
              }
              required
            />
          </label>
          <label>
            Date Attended:
            <input
              type="date"
              value={newConcert.dateAttended}
              onChange={(e) =>
                setNewConcert({ ...newConcert, dateAttended: e.target.value })
              }
              required
            />
          </label>
          <label>
            Rating (0-5):
            <input
              type="number"
              min="0"
              max="5"
              value={newConcert.rating}
              onChange={(e) =>
                setNewConcert({ ...newConcert, rating: +e.target.value })
              }
              required
            />
          </label>
          <label>
            Notes:
            <textarea
              value={newConcert.notes}
              onChange={(e) =>
                setNewConcert({ ...newConcert, notes: e.target.value })
              }
            />
          </label>
          <div className="popup-buttons">
            <button type="submit">Save Concert</button>
            <button type="button" onClick={closeConcertPopup}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
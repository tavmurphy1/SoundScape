import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../ConcertsPage.css';

const TICKETMASTER_API = 'https://app.ticketmaster.com/discovery/v2/events.json';
const API_KEY = 'XzpAgIiHS6LYrTkgPButoiw3LK9uBeNW';

function ConcertsPage() {
  const [location, setLocation] = useState('');
  const [events, setEvents] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [profileError, setProfileError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserProfile() {
      const token = localStorage.getItem('token');
      if (!token) {
        setProfileError('You must be logged in.');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`http://localhost:3002/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const userObj = await response.json();

        if (!response.ok) {
          throw new Error(userObj.error || 'Failed to fetch profile');
        }

        if (userObj?.homeCity) {
          setLocation(userObj.homeCity);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setProfileError('Unable to fetch user profile. Please log in again.');
        navigate('/login');
      }
    }

    fetchUserProfile();
  }, [navigate]);

  useEffect(() => {
    if (!location) return;
    fetchConcerts(location);
  }, [location]);

  async function fetchConcerts(city) {
    try {
      const url = `${TICKETMASTER_API}?apikey=${API_KEY}&classificationName=Music&city=${encodeURIComponent(city)}`;
      const response = await fetch(url);
      if (!response.ok) {
        console.error('Error fetching from Ticketmaster:', response.statusText);
        return;
      }
      const data = await response.json();
      const eventsArray = data?._embedded?.events || [];
      setEvents(eventsArray);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }

  function handleSortChange(newSort) {
    setSortBy(newSort);
  }

  const sortedEvents = [...events].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.dates.start.dateTime || a.dates.start.localDate);
      const dateB = new Date(b.dates.start.dateTime || b.dates.start.localDate);
      return dateA - dateB;
    } else if (sortBy === 'name') {
      const nameA = (a?.name || '').toLowerCase();
      const nameB = (b?.name || '').toLowerCase();
      return nameA.localeCompare(nameB);
    }
    return 0;
  });

  return (
    <div className="concerts-container">
      <NavBar />
      <h1 className="concerts-title">Concerts</h1>

      {profileError && <p className="profile-error">{profileError}</p>}

      <div className="concerts-filters">
        <div className="concerts-location-wrapper">
          <input
            className="concerts-location-input"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button
            className="concerts-clear-button"
            onClick={() => setLocation('')}
          >
            x
          </button>
        </div>

        <span className="sort-label">Sort By</span>
        <button className="sort-button" onClick={() => handleSortChange('date')}>
          Date
        </button>
        <button className="sort-button" onClick={() => handleSortChange('name')}>
          A-Z
        </button>
      </div>

      <div className="concerts-grid">
        {sortedEvents.map((event) => {
          const eventId = event.id;
          const eventName = event.name || 'Unknown Event';
          const imageObj = event.images?.[0];
          const imageUrl = imageObj ? imageObj.url : 'https://via.placeholder.com/200';

          let venueName = 'Unknown Venue';
          let city = 'Unknown City';
          let region = '';
          if (event._embedded?.venues?.[0]) {
            const venue = event._embedded.venues[0];
            venueName = venue.name || venueName;
            city = venue.city?.name || city;
            region = venue.state?.stateCode || venue.country?.countryCode || '';
          }

          const dateTime = event.dates.start.dateTime || event.dates.start.localDate;
          const formattedDate = dateTime
            ? new Date(dateTime).toLocaleString(undefined, {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })
            : 'TBA';

          return (
            <div className="concert-card" key={eventId}>
              <Link to={`/concert/${eventId}`}>
                <img className="concert-card-image" src={imageUrl} alt={eventName} />
              </Link>
              <h3 className="concert-card-title">{eventName}</h3>
              <p>{venueName}</p>
              <p>{city}, {region}</p>
              <p>{formattedDate}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ConcertsPage;

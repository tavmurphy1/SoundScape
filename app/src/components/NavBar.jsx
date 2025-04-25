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

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../NavBar.css';

function NavBar() {
  const navigate = useNavigate();

  function handleConcertsClick() {
    navigate('/concerts');
  }

  function handleProfileClick() {
    navigate('/profile');
  }

  function handleLogoutClick() {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      // Remove the JWT token from localStorage
      localStorage.removeItem('jwtToken');
      // Optionally, you could clear any other user-related data
      navigate('/login');
    }
  }
  
  return (
    <div className="nav-container">
      <button className="nav-button" onClick={handleConcertsClick}>
        Concerts
      </button>
      <button className="nav-button" onClick={handleProfileClick}>
        My Profile
      </button>
      <button className="nav-button" onClick={handleLogoutClick}>
        Log Out
      </button>
    </div>
  );
}

export default NavBar;
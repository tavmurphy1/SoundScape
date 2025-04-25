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
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import ProfilePage from './pages/ProfilePage';
import ConcertsPage from './pages/ConcertsPage';
import ConcertIndividualPage from './pages/ConcertIndividualPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/concerts" element={<ConcertsPage />} />
        <Route path="/concert/:eventId" element={<ConcertIndividualPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

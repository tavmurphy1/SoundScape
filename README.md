# SoundScape

SoundScape is a full-stack concert recommendation web application that helps users discover live music events based on their favorite artists and location. It integrates with the Spotify and Ticketmaster APIs via dedicated microservices, and includes user authentication, favorites, and concert logging features.

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Architecture](#architecture)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Environment Variables](#environment-variables)  
  - [Running the App](#running-the-app)  
  - [One-Command Startup](#one-command-startup)  
- [Project Structure](#project-structure)  
- [API Reference](#api-reference)  
- [Usage](#usage)  
- [Contributing](#contributing)  
- [License](#license)  

## Features

- **User Authentication**  
  - Email/password registration & login  
  - JWT-based “Bearer” token flow  
- **Personalized Recommendations**  
  - Pulls your top artists from Spotify  
  - Curates upcoming shows via Ticketmaster  
- **Favorites**  
  - Save up to 4 artists for tailored recommendations  
- **Concert Logging**  
  - Record shows you’ve attended (date, venue, rating, notes)  
- **In-App Music Preview**  
  - Embedded Spotify playlist on concert pages  
- **Filtering & Sorting**  
  - Browse concerts by date or alphabetically  
- **Secure Routes**  
  - Protected frontend routes redirect to login if unauthenticated  

## Tech Stack

**Frontend**  
- React (Create React App)  
- React Router  

**Backend & Microservices**  
- Node.js & Express  
- MongoDB & Mongoose  

| Microservice            | Port   | Responsibilities                                    |
|-------------------------|--------|-----------------------------------------------------|
| User Auth               | 3002   | `/users` routes: register, login, profile, update   |
| Concert Log             | 3001   | `/concertlog`: CRUD for attended concerts           |
| Favorites               | 3004   | `/favorites`: CRUD for favorite artists             |
| Spotify Player          | 3003   | `/spotify/artist-playlist`: returns embed links     |

**APIs**  
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)  
- [Ticketmaster Discovery API](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/)  

## Architecture

SoundScape is built using a microservice architecture:

1. **Frontend**  
   - React SPA that communicates with four backend services via RESTful calls  
2. **User Auth Service**  
   - Handles registration, login (issues JWT), profile read/update  
3. **Concert Log Service**  
   - Stores “logged concerts” per user  
4. **Favorites Service**  
   - Manages users’ favorite artist list  
5. **Spotify Player Service**  
   - Fetches and returns Spotify playlist embed links  
6. **Ticketmaster Integration**  
   - Frontend directly fetches concert listings from Ticketmaster’s API  

All services are CORS-enabled for `http://localhost:3000`.

## Getting Started

### Prerequisites

- Node.js & npm  
- MongoDB (local or Atlas)  
- Spotify Developer account (Client ID & Secret)  
- Ticketmaster Developer API key  

### Installation

1. Clone the repo and navigate into it:  
   <pre>
   git clone https://github.com/<your-username>/SoundScape.git
   cd SoundScape
   </pre>

2.	Install dependencies for each service and the frontend:
    # In root:
  	<pre>
        npm install
	</pre>

    # Then for each microservice folder:
  	<pre>
        cd user-auth && npm install && cd ../concert-log && npm install && cd ../favorites && npm install && cd ../spotify-player && npm install'
	</pre>

    # And frontend:
  	<pre>
	cd ../app && npm install
	</pre>
    

### Environment Variables

Create a .env in each folder using these templates:
## Frontend (app/.env)
<pre>
REACT_APP_CONCERTLOG_URL=http://localhost:3001
REACT_APP_USER_AUTH_URL=http://localhost:3002
REACT_APP_SPOTIFY_URL=http://localhost:3003
REACT_APP_FAVORITES_URL=http://localhost:3004'
</pre>

## User Auth Service
<pre>
PORT=3002
MONGODB_CONNECT_STRING=<your_mongo_uri>
JWT_SECRET=<your_jwt_secret>
</pre>

## Concert Log Service (concert-log/.env)
<pre>
PORT=3001
MONGO_DB_CONNECT_STRING=<your_mongo_uri>
</pre>

## Favorites Service
<pre>
PORT=3004
MONGO_DB_CONNECT_STRING=<your_mongo_uri>
</pre>

## Spotify Player Service (spotifyplayer/.env)
<pre>
PORT=3003
SPOTIFY_CLIENT_ID=<your_spotify_client_id>
SPOTIFY_CLIENT_SECRET=<your_spotify_client_secret>
</pre>

### Running the App

1. At the root of the project:

<pre>
npm run start:all
</pre>

### Project Structure

/
├── app/                   # React frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── …
│   └── .env
├── userauth/             # Authentication & profiles
├── concertlog/           # Logged concerts CRUD
├── favorites/             # Favorite artists CRUD
├── spotifyplayer/        # Spotify embed link service
└── README.md

### API Reference 

## Auth Service (3002)
	•	POST /users/register
	•	POST /users/login
	•	GET /users/profile
	•	PUT /users/profile

## Concert Log Service (3001)
	•	GET /concertlog?userID=<id>
	•	POST /concertlog

## Favorites Service (3004)
	•	GET /favorites
	•	POST /favorites
	•	DELETE /favorites/:id

## Spotify Player Service (3003)
	•	GET /spotify/artist-playlist?artist=<name>

## Usage
	1.	Register or log in with your email, username, and home city
	2.	Browse personalized concert listings based on your favorite artists and location
	3.	Click a concert to view details and listen to the artist’s playlist
	4.	Save artists to your favorites for faster recommendations
	5.	Log concerts you’ve attended with ratings and notes

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

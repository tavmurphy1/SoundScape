/* 
 * Author: Tavner Murphy
 * Date: 2/23/2024
 *
 * This express server microservice fetches a Spotify link to an artist's playlist using the Spotify API.
 * It returns an embed link to the calling process.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');             // add this

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Get Spotify Access Token from Spotify API
const getSpotifyAccessToken = async () => {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64'),
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  });
  const data = await response.json();
  return data.access_token;
};

// Query using artist name, filter out null items
const searchPlaylistOnSpotify = async (query, accessToken) => {
  console.log('Searching Spotify with query:', query);
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=playlist&limit=5`,
    { headers: { 'Authorization': `Bearer ${accessToken}` } }
  );
  const data = await response.json();
  console.log('Spotify API response:', data);
  return (data.playlists?.items || []).filter(item => item);
};

// GET endpoint for Spotify artist playlist
app.get('/spotify/artist-playlist', async (req, res) => {
  const { artist } = req.query;
  if (!artist) {
    return res.status(400).json({ error: 'Artist name parameter is required' });
  }
  try {
    const accessToken = await getSpotifyAccessToken();
    const playlists = await searchPlaylistOnSpotify(artist, accessToken);
    if (playlists.length > 0) {
      const playlistId = playlists[0].id;
      const embedLink = `https://open.spotify.com/embed/playlist/${playlistId}`;
      return res.json({ embedLink });
    }
    return res.status(404).json({ error: 'No public playlist found for the specified artist' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Spotify Artist Playlist Microservice listening on port ${PORT}`);
});

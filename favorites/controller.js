/* 
 * Author: Tavner Murphy
 * Date: 3/11/2024
 * Express Route Handler for Favorite Artists
 */

const Favorite = require('./favorites');

// Gets artist photo URL from Ticketmaster API
async function getArtistPhotoUrl(artist) {
  console.log(`Attempting to fetch photo for artist: "${artist}" from Ticketmaster`);
  const API_KEY = process.env.TICKETMASTER_API_KEY;
  const endpoint = `https://app.ticketmaster.com/discovery/v2/attractions.json?apikey=${API_KEY}&keyword=${encodeURIComponent(artist)}&size=1`;
  console.log(`Ticketmaster endpoint: ${endpoint}`);

  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Ticketmaster API error: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('Ticketmaster API response:', JSON.stringify(data, null, 2));

  if (data._embedded && data._embedded.attractions && data._embedded.attractions.length > 0) {
    const attraction = data._embedded.attractions[0];
    console.log('First attraction found:', attraction.name);

    if (attraction.images && attraction.images.length > 0) {
      console.log(`Returning image URL: ${attraction.images[0].url}`);
      return attraction.images[0].url;
    }
  }

  console.log('No suitable image found, returning empty string');
  return ""; // Return empty string if not found
}

// GET: Retrieve favorite artists for the current user
exports.getFavorites = async (req, res) => {
  const userID = req.userId;
  console.log(`getFavorites called for userID: ${userID}`);

  try {
    const favorites = await Favorite.find({ userID });
    console.log('Favorites from DB:', favorites);
    res.json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST: Add a new favorite artist, 4 max per user
exports.addFavorite = async (req, res) => {
  const userID = req.userId;
  const { artist } = req.body;
  console.log(`addFavorite called for userID: ${userID}, artist: "${artist}"`);

  if (!artist) {
    console.log('No artist name provided in request body');
    return res.status(400).json({ error: "Artist name is required" });
  }

  try {
    // Check if user already has 4 favorites
    const count = await Favorite.countDocuments({ userID });
    console.log(`Current favorite count for user ${userID}:`, count);
    if (count >= 4) {
      console.log(`User ${userID} has reached maximum favorites (4)`);
      return res.status(400).json({ error: "Maximum of 4 favorite artists allowed" });
    }

    // Always fetch a photo URL from Ticketmaster API
    console.log(`Fetching photo for artist "${artist}"...`);
    let finalPhotoUrl = "";
    try {
      finalPhotoUrl = await getArtistPhotoUrl(artist);
    } catch (error) {
      console.error("Error fetching artist photo:", error);
      // finalPhotoUrl stays as an empty string if lookup fails
    }

    console.log(`Saving new favorite for user ${userID}: artist="${artist}", photoUrl="${finalPhotoUrl}"`);
    const newFavorite = new Favorite({
      userID,
      artist,
      photoUrl: finalPhotoUrl
    });
    await newFavorite.save();

    console.log('New favorite successfully saved:', newFavorite);
    res.status(201).json(newFavorite);
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE: Remove a favorite artist by ID
exports.removeFavorite = async (req, res) => {
  const userID = req.userId;
  const { id } = req.params;
  console.log(`removeFavorite called for user ${userID}, favorite ID: ${id}`);

  try {
    const favorite = await Favorite.findOneAndDelete({ _id: id, userID });
    if (!favorite) {
      console.log(`No favorite artist with ID ${id} found for user ${userID}`);
      return res.status(404).json({ error: "Favorite artist not found" });
    }
    console.log(`Favorite artist with ID ${id} removed successfully`);
    res.json({ message: "Favorite artist removed successfully" });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
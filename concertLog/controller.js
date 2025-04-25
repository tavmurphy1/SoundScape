//Authors:Tavner Murphy & Elizabeth Kacala
//Date: 3/11/2024
//Express Route Controller

// controller.js
const Concert = require('./concertlog');

// GET: Retrieve all concerts for a given user (expects query parameter userID)
exports.getConcerts = async (req, res) => {
  console.log('Received concert data:', req.body);
  const { userID } = req.query;
  if (!userID) {
    return res.status(400).json({ error: "userID is required" });
  }
  try {
    const concerts = await Concert.find({ userID });
    res.json(concerts);
  } catch (error) {
    console.error("Error retrieving concerts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST: Create a new concert log
// In controller.js (createConcert)
exports.createConcert = async (req, res) => {
  console.log('Received concert data:', req.body);
  const { userID, artist, venue, dateAttended, notes, rating } = req.body;
  
  if (!userID || !artist || !venue || !dateAttended || rating === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  try {
    // Convert rating to a number (if it's not already)
    const numericRating = Number(rating);
    if (isNaN(numericRating)) {
      return res.status(400).json({ error: "Rating must be a number" });
    }

    const newConcert = new Concert({
      userID,
      artist,
      venue,
      dateAttended: new Date(dateAttended),
      notes: notes || '',
      rating: numericRating
    });
    await newConcert.save();
    console.log('Successfully added data:', newConcert);
    res.status(201).json(newConcert);
  } catch (error) {
    console.error('Error adding data:', error);
    res.status(400).json({ error: 'Error adding concert data' });
  }
};

// PUT: Update a concert log by its ID
exports.updateConcert = async (req, res) => {
  console.log('Received concert data:', req.body);
  const { id } = req.params;
  const { artist, venue, dateAttended, notes, rating } = req.body;
  
  let updateObj = {};
  if (artist && artist !== 'NULL') updateObj.artist = artist;
  if (venue && venue !== 'NULL') updateObj.venue = venue;
  if (dateAttended && dateAttended !== 'NULL') updateObj.dateAttended = new Date(dateAttended);
  if (notes !== undefined && notes !== 'NULL') updateObj.notes = notes;
  if (rating !== undefined && rating !== 'NULL') updateObj.rating = rating;
  
  try {
    const updatedConcert = await Concert.findByIdAndUpdate(id, updateObj, { new: true });
    if (!updatedConcert) {
      return res.status(404).json({ error: "Concert not found" });
    }
    res.json(updatedConcert);
  } catch (error) {
    console.error("Error updating concert:", error);
    res.status(400).json({ error: "Error updating concert data" });
  }
};

// DELETE: Remove a concert log by its ID
exports.deleteConcert = async (req, res) => {
  console.log('Received concert data:', req.body);
  const { id } = req.params;
  try {
    const deletedConcert = await Concert.findByIdAndDelete(id);
    if (!deletedConcert) {
      return res.status(404).json({ error: "Concert not found" });
    }
    res.json({ message: "Concert deleted successfully" });
  } catch (error) {
    console.error("Error deleting concert:", error);
    res.status(400).json({ error: "Error deleting concert data" });
  }
};
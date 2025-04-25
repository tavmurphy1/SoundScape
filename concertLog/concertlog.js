//Authors:Tavner Murphy & Elizabeth Kacala
//Date: 3/11/2024
//Concert Logger Schema

// concertlog.js
const mongoose = require('mongoose');

const concertSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  artist: { type: String, required: true },
  venue: { type: String, required: true },
  dateAttended: { type: Date, required: true },
  notes: { type: String, default: '' },
  rating: { type: Number, required: true, min: 0, max: 5 }
});

module.exports = mongoose.model('Concert', concertSchema);
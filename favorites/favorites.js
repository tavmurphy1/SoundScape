/* 
 * Author: Tavner Murphy
 * Date: 3/11/2024
 * Mongoose Schema for Favorite Artists
*/

const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userID: { type: String, required: true },  // Using String to store MongoDB _id
  artist: { type: String, required: true },
  photoUrl: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
// Author: Tavner Murphy
// Date: 3/10/25

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    homeCity: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    // May be used later
    profile: { type: Object, default: {} },
    favorites: { type: [String], default: [] },
    concerts: { type: [String], default: [] }
  });

module.exports = mongoose.model('User', userSchema);
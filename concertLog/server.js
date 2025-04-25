// Authors: Tavner Murphy & Elizabeth Kacala
// Date: 3/11/2024

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');       // add this

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_DB_CONNECT_STRING)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Import and mount the routes
const routes = require('./routes');
app.use('/concertlog', routes);

// Start server
app.listen(PORT, () => {
  console.log(`ConcertLog microservice listening on http://localhost:${PORT}`);
});
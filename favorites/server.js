// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const favoritesRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_DB_CONNECT_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

app.use('/favorites', favoritesRoutes);

app.listen(PORT, () => {
  console.log(`Favorites Microservice listening on port ${PORT}`);
});
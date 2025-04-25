// Author: Tavner Murphy
// Date: 3/10/25

// server.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const usersRoutes = require('./usersRoutes');

const app = express();
const port = process.env.PORT

app.use(cors({
  origin: 'http://localhost:3000', // React app origin
  credentials: true,
}));

// Connect to MongoDB using connection string from .env
mongoose.connect(process.env.MONGODB_CONNECT_STRING).then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error(err));

// Middleware
app.use((req, res, next) => {
  console.log(`Backend received: ${req.method} ${req.originalUrl}`);
  next();
});
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// Mount user routes
app.use('/users', usersRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
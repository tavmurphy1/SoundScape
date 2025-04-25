/* 
 * Author: Tavner Murphy
 * Date: 3/11/2024
* Express Route Handler for Favorite Artists
*/

// routes.js
const express = require('express');
const router = express.Router();
const favoritesController = require('./controller');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const JWT_SECRET = process.env.JWT_SECRET;
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  
  // Expected format: "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Failed to authenticate token' });
    req.userId = decoded.userId;
    next();
  });
};

// Every endpoint below below requires the token
router.use(verifyToken);

// GET /favorites - retrieve favorite artists for current user
router.get('/', favoritesController.getFavorites);

// POST /favorites - add a favorite
router.post('/', favoritesController.addFavorite);

// DELETE /favorites/:id - remove a favorite by its ID
router.delete('/:id', favoritesController.removeFavorite);

module.exports = router;
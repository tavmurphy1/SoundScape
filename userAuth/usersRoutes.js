// routes.js
const express = require('express');
const router = express.Router();
const usersController = require('./usersController');

// Public endpoints (no token required)
router.post('/register', usersController.register);
router.post('/login', usersController.login);

//verifyToken applies to following routes
router.use(usersController.verifyToken);

// Protected endpoints
router.get('/profile', usersController.getProfile);
router.put('/profile', usersController.updateProfile);
router.post('/change-password', usersController.changePassword);
router.get('/logout', usersController.logout);

module.exports = router;
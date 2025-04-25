//Authors:Tavner Murphy & Elizabeth Kacala
//Date: 3/11/2024

// routes.js
const express = require('express');
const router = express.Router();
const concertController = require('./controller');

// RESTful API router
// GET /concertlog?userID=...
router.get('/', concertController.getConcerts);

// POST /concertlog to create a new concert log
router.post('/', concertController.createConcert);

// PUT /concertlog/:id to update a concert log by its ID
router.put('/:id', concertController.updateConcert);

// DELETE /concertlog/:id to delete a concert log by its ID
router.delete('/:id', concertController.deleteConcert);

module.exports = router;
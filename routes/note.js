const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note');

// Create a new note
router.post('/', noteController.createNote);

// Get all notes
router.get('/', noteController.getAllNotes);

// Get a specific note by ID
router.get('/:id', noteController.getNoteById);

// Update a note by ID
router.put('/:id', noteController.updateNote);

// Delete a note by ID
router.delete('/:id', noteController.deleteNote);

module.exports = router;

const Note = require('../models/Note');


exports.createNote = async (req, res) => {
	console.log(req.body);
    try {
        const { title, description } = req.body;
        const newNote = new Note({
           title,
           description,
       });
        await newNote.save();
        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ message: 'Error creating note', error });
    }
};


// Get all notes
exports.getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notes', error });
    }
};

// Get a specific note by ID
exports.getNoteById = async (req, res) => {
    try {
        const noteId = req.params.id;
        const note = await Note.findById(noteId);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching note', error });
    }
};

// Update a note by ID
exports.updateNote = async (req, res) => {
    try {
        const noteId = req.params.id;
        const { title, description } = req.body;

        const updatedNote = await Note.findByIdAndUpdate(
            noteId,
            {
                title,
                description,
                updatedAt: Date.now(),
            },
            { new: true } // Return the updated note
        );

        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(500).json({ message: 'Error updating note', error });
    }
};

// Delete a note by ID
exports.deleteNote = async (req, res) => {
    try {
        const noteId = req.params.id;

        const deletedNote = await Note.findByIdAndDelete(noteId);

        if (!deletedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting note', error });
    }
};

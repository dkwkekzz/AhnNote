const express = require('express');
const router = express.Router();
const {
    getNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote
} = require('../controllers/noteController');

// 노트 라우트
router.route('/')
    .get(getNotes)
    .post(createNote);

router.route('/:id')
    .get(getNote)
    .put(updateNote)
    .delete(deleteNote);

module.exports = router;

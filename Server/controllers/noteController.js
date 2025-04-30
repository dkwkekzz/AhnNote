const Note = require('../models/Note');

// 모든 노트 가져오기
exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 특정 노트 가져오기
exports.getNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: '노트를 찾을 수 없습니다' });
        }
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 새 노트 생성
exports.createNote = async (req, res) => {
    try {
        const note = await Note.create(req.body);
        res.status(201).json(note);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 노트 수정
exports.updateNote = async (req, res) => {
    try {
        const note = await Note.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!note) {
            return res.status(404).json({ message: '노트를 찾을 수 없습니다' });
        }
        res.status(200).json(note);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 노트 삭제
exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id);
        if (!note) {
            return res.status(404).json({ message: '노트를 찾을 수 없습니다' });
        }
        res.status(200).json({ message: '노트가 삭제되었습니다' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 
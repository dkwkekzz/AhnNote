const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, '제목을 입력해주세요'],
        trim: true,
        maxlength: [50, '제목은 50자를 초과할 수 없습니다']
    },
    content: {
        type: String,
        required: [true, '내용을 입력해주세요'],
        trim: true
    },
    author: {
        type: String,
        required: [true, '작성자를 입력해주세요'],
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Note', noteSchema); 
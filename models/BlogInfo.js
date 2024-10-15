const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogInfoSchema = new Schema({
    user_identity: {
        type: String,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    create_date: {
        type: Date,
        default: Date.now,
    },
    tags: {
        type: [String],
        default: [],
    },
    is_published: {
        type: Boolean,
        default: false,
    },
    views: {
        type: Number,
        default: 0,
    },
});

// 导出模型
module.exports = mongoose.model('BlogInfo', blogInfoSchema);

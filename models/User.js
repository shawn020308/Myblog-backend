const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    user_name: {
        type: String,
        required: true,
    },
    user_email:{
        type: String,
        required: true,
    },
    user_password: {
        type: String,
        required: true,
    },
    user_avatar: {
        type: String,
    },
    user_identity:{
        type: String,
    },
    create_date: {
        type: String,
        default: Date.now(),
    }
})

module.exports = User = mongoose.model('User', userSchema);
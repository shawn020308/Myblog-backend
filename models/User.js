const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    user_name: {
        type: String,
        required: true,
    },
    user_email: {
        type: String,
        required: true,
        unique: true,
        match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
    },
    user_password: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return v.length >= 8 && /[a-z]/i.test(v) && /\d/.test(v);
            },
            message: props => `${props.value} is not a valid password!`
        }
    },
    user_avatar: {
        type: String,
    },
    user_identity: {
        type: String,
        enum: ['admin', 'common'],
    },
    create_date: {
        type: Date,
        default: Date.now,
    }
});

module.exports = User = mongoose.model('User', userSchema);
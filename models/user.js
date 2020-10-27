const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        default: 'user'
    },
    password: {
        type: String,
        required: true
    },
    offersBought: [{
        type: 'ObjectId',
        ref: 'shoesOffers'
    }]
});

module.exports = mongoose.model('users', UserSchema);

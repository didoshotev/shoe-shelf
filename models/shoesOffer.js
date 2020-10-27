const mongoose = require('mongoose');

const shoesOfferSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    imageUrl: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        default: 'No brand'
    },
    description: {
        type: String
    },
    creatorName: {
        type: String,

    },
    createdAt: {
        lastActiveAt: Date
    },
    buyers: [{
        type: String,
        ref: 'users'
    }],
});

module.exports = mongoose.model('shoesOffers', shoesOfferSchema);

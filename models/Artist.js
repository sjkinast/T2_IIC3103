const mongoose = require('mongoose');

const ArtistSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    albums: {
        type: String,
        required: true,
    },
    tracks: {
        type: String,
        required: true,
    },
    self: {
        type: String,
        required: true,
    },
});

ArtistSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
}); 

module.exports = mongoose.model('Artist',ArtistSchema);


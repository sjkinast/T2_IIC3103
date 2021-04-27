const mongoose = require('mongoose');


const AlbumSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    artistId: {
        type: String,
        required: true,
    },
    artist: {
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

AlbumSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        ret.artist_id = ret.artistId;
        delete ret.artistId;
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('Album',AlbumSchema);
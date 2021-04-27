const mongoose = require('mongoose');

const TrackSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    timesPlayed: {
        type: Number,
        required: true,
    },
    albumId: {
        type: String,
        required: true,
    },
    artist: {
        type: String,
        required: true,
    },
    album: {
        type: String,
        required: true,
    },
    self: {
        type: String,
        required: true,
    },
});

TrackSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        ret.album_id = ret.albumId;
        ret.times_played = ret.timesPlayed;
        delete ret._id;
        delete ret.albumId;
        delete ret.timesPlayed;
        delete ret.__v;
    }
});

module.exports = mongoose.model('Track',TrackSchema);
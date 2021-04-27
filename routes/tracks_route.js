const express = require('express');
const router = express.Router();
const Track = require('../models/Track');


// GET METHODS
router.get('/', async (req, res) => {
    try {
        const tracks = await Track.find();
        res.send(tracks);
    } catch (err) {
        res.status(404).send(err.message);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const track = await Track.findById(req.params.id);
        res.send(track);
    } catch (err) {
        res.status(404).send(err.message);
    }
});

// PUT METHODS

///tracks/<track_id>/play

router.put('/:id/play', async (req, res) => {
    try {
        const track = await Track.findByIdAndUpdate(req.params.id, { $inc : { timesPlayed: 1 }}, {new: true, useFindAndModify: false});
        if (track) {
            res.status(200).send({description: 'canción reproducida'});
        } else {
            res.status(404).send({description: 'canción no encontrada'});
        }

    } catch (err) {
        res.status(500).send({Error: err.message});
    }
});

// DELETE METHODS

// /tracks/<track_id>

router.delete('/:id', async (req, res) => {
    try{
        const track = await Track.findByIdAndDelete(req.params.id);
        if (track) {
            res.status(204).send({description: 'canción eliminada'});
        } else {
            res.status(404).send({description: 'canción inexistente'});
        }
    } catch (err) {
        res.status(500).send({Error: err.message});
    }
});

module.exports = router;

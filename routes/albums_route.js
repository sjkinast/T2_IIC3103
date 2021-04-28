const Joi  = require('joi');
const express = require('express');
const router = express.Router({ automatic405: true });
const Album = require('../models/Album');
const Track = require('../models/Track');

const validateTrack = (track) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        duration: Joi.number().min(0).required(),
    });
    return schema.validate(track);
};

//GET METHODS

// /albums
router.get('/', async (req, res) => {
    try {
        const albums = await Album.find();
        res.send(albums);
    } catch (err) {
        res.status(500).send({Error: err.message});
    }
});

// /albums/<album_id>
router.get('/:id', async (req, res) => {
    try {
        const album = await Album.findById(req.params.id);
        if (album) {
            res.status(200).send(album);
        } else {
            res.status(404).send({description: 'álbum no encontrado'})
        }
    } catch (err) {
        res.status(500).send({Error: err.message});
    }
});

// /albums/<album_id>/tracks
router.get('/:id/tracks', async (req, res) => {
    try {
        const album = await Album.findById(req.params.id);
        if (album) {
            const tracks = await Track.find({ albumId: req.params.id});
            res.status(200).send(tracks);
        } else {
            res.status(404).send({description: 'álbum no encontrado'});
        }
    } catch (err) {
        res.status(500).send({Error: err.message});
    }
});

// POST METHODS

// /albums/<album_id>/tracks
router.post('/:id/tracks', async (req, res) => {
    const { error } = validateTrack(req.body);
    if (error) {
        res.status(400).send({description: 'input inválido'});
        return;
    }
    try {
        const album = await Album.findById(req.params.id);
        if (album) {
            const _id = Buffer.from(`${req.body.name}:${req.params.id}`).toString('base64').slice(0,22);
            const track = new Track({
                _id: _id,
                name: req.body.name,
                duration: req.body.duration,
                timesPlayed: 0,
                albumId: req.params.id,
                artist: `/artists/${album.artistId}`,
                album: `/albums/${req.params.id}`,
                self: `/tracks/${_id}`,
            });
            const savedTrack = await track.save();
            res.status(201).send(savedTrack);
        } else {
            res.status(422).send({description: 'álbum no existe'});
        }
    } catch (err) {
        res.status(409).send({Error: 'canción ya existe'});
    }
});

// PUT METHODS

// /albums/<album_id>/tracks/play

router.put('/:id/tracks/play', async (req, res) => {
    try {
        const album = await Album.findById(req.params.id);
        if (album) {
            await Track.updateMany({ 
                albumId: req.params.id
            },
            {
                $inc : { timesPlayed: 1 }     
            });
            res.status(200).send({description: 'canciones del álbum reproducidas'});
        } else {
            res.status(404).send({description: 'álbum no encontrado'});
        }
    } catch (err) {
        res.status(500).send({Error: err.message});
    }
});

// DELETE METHODS

// /albums/<album_id>

router.delete('/:id', async (req, res) => {
    try{
        const album = await Album.findByIdAndDelete(req.params.id);
        if (album) {
            await Track.deleteMany({ albumId: req.params.id });
            res.status(204).send({description: 'álbum eliminado'});
        } else {
            res.status(404).send({description: 'álbum no encontrado'});
        }
    } catch (err) {
        res.status(500).send({Error: err.message});
    }
});

module.exports = router;

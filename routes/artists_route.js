const Joi  = require('joi');
const express = require('express');
const router = express.Router();
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Track = require('../models/Track');

const validateArtist = (artist) => {
    const schema = Joi.object({
        name: Joi.string().min(1).required(),
        age: Joi.number().integer().min(0).required(),
    });
    return schema.validate(artist);
};

const validateAlbum = (album) => {
    const schema = Joi.object({
        name: Joi.string().min(1).required(),
        genre: Joi.string().min(1).required(),
    });
    return schema.validate(album);
};

// GET METHODS

// /artists
router.get('/', async (req, res) => {
    await Artist.find((err, artists) => {
        if (err) res.status(500).send({Error: err.message});
        else res.status(200).send(artists);
    });
});

// /artists/<artist_id>
router.get('/:id', async (req,res) => {
    await Artist.findById(req.params.id, (err, artist) => {
        if (err) res.status(500).send({Error: err.message});
        else if (artist) res.status(200).send(artist);
        else res.status(404).send({ description: 'artista no encontrado' });
    });

});

// /artists/<artist_id>/albums
router.get('/:id/albums', async (req, res) => {
    try {
        const artist  = await Artist.findById(req.params.id);
        if (artist){
            const albums = await Album.find({artistId: req.params.id});
            res.status(200).send(albums);
        } else {
            res.status(404).send({description: 'artista no encontrado'});
        }
    } catch (err) {
        res.status(500).send({Error: err.message});
    }
});

// /artists/<artist_id>/tracks
router.get('/:id/tracks', async (req, res) => {
    try {
        const artist  = await Artist.findById(req.params.id);
        if (artist) {
            const albums =  await Album.find({artistId: req.params.id}).distinct('_id');
            const tracks = await Track.find({
                albumId: { $in : albums}
            });
            res.status(200).send(tracks);   
        } else {
            res.status(404).send({description: 'artista no encontrado'});
        }
    } catch(err) {
        res.status(500).send({Error: err.message});
    }
});

// POST METHODS 

// POST /artists
router.post('/', async (req, res) => {
    const { error } = validateArtist(req.body);
    if (error) {
        res.status(400).send({description: 'input inválido'});
        return;
    }

    const _id = Buffer.from(req.body.name).toString('base64').slice(0,22);
    const artist = new Artist({
        _id: _id,
        name: req.body.name,
        age: req.body.age,
        self: `/artists/${_id}`,
        albums: `/artists/${_id}/albums`,
        tracks: `/artists/${_id}/tracks`,
    });
    try{
        const savedArtist =  await artist.save();
        res.status(201).send(savedArtist);
    } catch(err){
        res.status(409).send({ description: 'artista ya existe'});
    }
});

// POST /artists/<artistId>/albums
router.post('/:id/albums', async (req,res) => {
    const { error } = validateAlbum(req.body);
    if (error){
        res.status(400).send({description: 'input inválido'});
        return;
    }
    try {
        const artist = await Artist.findById(req.params.id);
        if (artist) {
            const _id = Buffer.from(`${req.body.name}:${req.params.id}`).toString('base64').slice(0,22);
            const album = new Album({
                _id: _id,
                name: req.body.name,
                genre: req.body.genre,
                artistId: req.params.id,
                self: `/albums/${_id}`,
                artist: `/artists/${req.params.id}`,
                tracks: `/albums/${_id}/tracks`,
            });
            const savedAlbum =  await album.save();
            res.status(201).send(savedAlbum);
        } else {
            res.status(422).send({description: 'artista no existe'});
        }
    } catch (err) {
        res.status(409).send({description: 'álbum ya existe'});
    }
});

// PUT METHODS

// /artists/<artist_id>/albums/play:
router.put('/:id/albums/play', async (req,res) => {
    try {
        const artist = await Artist.findById(req.params.id);
        if (artist) {
            const albums =  await Album.find({artistId: req.params.id}).distinct('_id');
            await Track.updateMany({
                albumId: { $in : albums}
            },
            {
                $inc : { timesPlayed: 1 }
            });
            res.status(200).send({description: 'todas las canciones fueron reproducidas'});
        } else {
            res.status(404).send({description: 'artista no encontrado'});
        }
    } catch (err) {
        res.status(500).send({Error: err.message});
    }
});

// DELETE METHODS

// /artists/<artist_id>

router.delete('/:id', async (req, res) => {
    try{
        const artist = await Artist.findByIdAndDelete(req.params.id);
        if (artist) {
            const albums = await Album.find({ artistId: req.params.id }).distinct('_id');
            if (albums.length > 0) {
                await Track.deleteMany({albumId: {$in: albums}});
            }
            await Album.deleteMany({ artistId: req.params.id });
            res.status(204).send({description: 'artista eliminado'});
        } else {
            res.status(404).send({description: 'artista inexistente'});
        }
    } catch (err) {
        res.status(500).send({Error: err.message});
    }
});

module.exports = router;
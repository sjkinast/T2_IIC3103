const express = require('express');

const app = express();

const mongoose = require('mongoose');

require('dotenv/config');

const artistsRoute = require('./routes/artists_route');

const albumsRoute = require('./routes/albums_route');

const tracksRoute = require('./routes/tracks_route');

app.use((req, res, next) => {
    if (!['GET', 'POST', 'PUT', 'DELETE'].includes(req.method)) {
        res.sendStatus(405);
    } else {
        next();
    }
});

app.use(express.json());

app.use('/artists', artistsRoute);

app.use('/albums', albumsRoute);

app.use('/tracks', tracksRoute);

app.get('/', (req,res, next) => {
    res.sendStatus(200);
    next();
});

//CONNECT TO DB
mongoose.connect(process.env.DB_CONNECTION,
{ useNewUrlParser: true, useUnifiedTopology: true },
(err) => {
    if (err) {
        console.error('App starting error:', err.stack);
        process.exit(1);
    } else {
        console.log('Connected to DB');
    }

});


// PORT & HOST
const port  = process.env.PORT || 3000;
const host = process.env.HOST || '8.8.8.8';

app.listen(port,host, () => console.log(`Listening on port ${port}...`));
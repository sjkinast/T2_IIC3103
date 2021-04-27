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

//CONNECT TO DB
mongoose.connect(process.env.DB_CONNECTION,
{ useNewUrlParser: true, useUnifiedTopology: true },
() => console.log('Connected to DB'),
);


// PORT
const port  = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
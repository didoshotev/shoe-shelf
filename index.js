require('dotenv').config();
const env = process.env.NODE_ENV;

const config = require('./config/config')[env];
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const DB_URL = process.env.DATABASE_URL;
const indexRoute = require('./routes/index');
const authRoute = require('./routes/auth');
const offerRoute = require('./routes/offers');

mongoose.connect(config.databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err) => {
    if (err) {
        console.error(err);
        throw err;
    };
    console.log('Database is setup and running!');
});


require('./config/express')(app)
authRoute(app);
offerRoute(app);
indexRoute(app);

app.listen(config.port, console.log(`Listening on port ${config.port}!`))

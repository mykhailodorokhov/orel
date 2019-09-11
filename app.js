const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const welcomeRouter = require('./routers/welcome.js');
const organizationsRouter = require('./routers/organizations.js');
const relationsRouter = require('./routers/relations.js');

// Assigning Body Parser as a middleware to work with JSON io
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Catching Body Parser's exceptions
app.use(function(err, req, res, next) {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        res.status(400).send({ error: "An error happened while trying to process the provided JSON" });
    } else next();
});

// Connecting routers
app.use('/', welcomeRouter);
app.use('/api/', welcomeRouter);
app.use('/api/organizations', organizationsRouter);
app.use('/api/relations', relationsRouter);

module.exports = app;
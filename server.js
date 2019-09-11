const app = require('./app.js');

const PORT = process.env.PORT || 3000;

// Setting up a server on 3000 port
app.listen(PORT, () => {
    console.log("OREL - (or)ganization (rel)ationships is listening on port " + PORT);
});
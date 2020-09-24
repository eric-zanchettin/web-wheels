const express = require('express');
const server = express();
const routes = require('./src/routes/routes');

server.use(routes);

server.listen(3333, () => {
    console.log('Server is up and Running ...');
});
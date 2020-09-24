const express = require('express');
const server = express();
const nunjucks = require('nunjucks');
const routes = require('./src/routes/routes');

server.use(express.static('public'));

server.set('view engine', 'njk');

nunjucks.configure('src/views', {
    express: server,
    autoescape: false,
    noCache: true,
});

server.use(routes);

server.listen(3333, () => console.log('Server is up and Running ...'));
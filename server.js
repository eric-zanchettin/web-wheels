const express = require('express');
const server = express();
const nunjucks = require('nunjucks');
const methodOverride = require('method-override');
const routes = require('./src/routes/index');
const session = require('./config/session');

server.use(express.static('public'));
server.use(express.urlencoded({ extended: true }));
server.use(methodOverride('_method'));
server.use(session);
server.use((req, res, next) => {
    res.locals.session = req.session;

    next()
});

server.set('view engine', 'njk');

nunjucks.configure('src/app/views', {
    express: server,
    autoescape: false,
    noCache: true,
});

server.use(routes);

server.listen(3333, () => console.log('Server is up and Running ...'));
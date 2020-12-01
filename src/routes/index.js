const express = require('express');
const routes = express.Router();

const HomeController = require('../app/controllers/HomeController');

const users = require('./users');
const sell = require('./sell');
const api = require('./api');

routes.use('/users', users);
routes.use('/sell', sell);
routes.use('/api', api);

// HOME

routes.get('/', HomeController.home);
routes.get('/find/?', HomeController.find);

module.exports = routes;
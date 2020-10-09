const express = require('express');
const routes = express.Router();

const HomeController = require('../app/controllers/HomeController');

const users = require('./users');

// HOME

routes.get('/', HomeController.home);

routes.use('/users', users);

module.exports = routes;
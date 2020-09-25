const express = require('express');
const routes = express.Router();

const HomeController = require('../app/controllers/HomeController');
const UserController = require('../app/controllers/UserController');

// HOME

routes.get('/', HomeController.home);

// LOGIN

routes.get('/users/login', UserController.loginForm);
routes.post('/users/login', UserController.login);

module.exports = routes;
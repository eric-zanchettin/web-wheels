const express = require('express');
const routes = express.Router();

const HomeController = require('../app/controllers/HomeController');
const UserController = require('../app/controllers/UserController');

const UserValidator = require('../app/validators/users');

// HOME

routes.get('/', HomeController.home);

// LOGIN

routes.get('/users/login', UserController.loginForm);
routes.post('/users/login', UserValidator.login, UserController.login);

// REGISTER

routes.get('/users/register', UserController.registerForm);
routes.post('/users/register', UserValidator.register, UserController.register);

// LOGOUT

routes.post('/users/logout', UserController.logout);

module.exports = routes;
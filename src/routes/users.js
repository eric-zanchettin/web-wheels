const express = require('express');
const routes = express.Router();

const SessionController = require('../app/controllers/SessionsController');
const UsersController = require('../app/controllers/UsersController');

const SessionValidator = require('../app/validators/sessions');
const UserValidator = require('../app/validators/users');

// SESSIONS
// LOGIN
routes.get('/login', SessionController.loginForm);
routes.post('/login', SessionValidator.login, SessionController.login);

// REGISTER
routes.get('/register', SessionController.registerForm);
routes.post('/register', SessionValidator.register, SessionController.register);

// FORGOT PASSWORD
routes.get('/forgot-password', SessionController.forgotForm);
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot);

// RESET PASSWORD
routes.get('/password-reset', SessionController.resetForm);
routes.post('/password-reset', SessionValidator.reset, SessionController.reset);

// LOGOUT
routes.post('/logout', SessionController.logout);

// USERS
// PROFILE
routes.get('/account/:id', UsersController.show);
routes.post('/account/:id', UserValidator.post, UsersController.post);
routes.put('/account/:id', UserValidator.put, UsersController.put);

routes.get('/password-change/', UsersController.passwordChangeForm);
routes.put('/password-change/', UserValidator.changePassword, UsersController.changePassword);

module.exports = routes;
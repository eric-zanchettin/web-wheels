const express = require('express');
const routes = express.Router();

const ApiController = require('../app/controllers/ApiController');

routes.get('/cars/data', ApiController.get);

module.exports = routes;
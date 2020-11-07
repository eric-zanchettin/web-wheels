const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer');

const SellController = require('../app/controllers/SellController');
const { onlyUsers } = require('../app/validators/sessions');
const SellValidator = require('../app/validators/sell');

// SELLING PAGE

routes.get('/', onlyUsers, SellController.sellPage);
routes.post('/', onlyUsers, multer.array('photos', 6), SellValidator.sellPost, SellController.sellPost);

// SHOW SELLING CAR

routes.get('/car/:id', SellController.show);

module.exports = routes;
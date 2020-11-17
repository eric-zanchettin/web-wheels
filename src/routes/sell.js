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

routes.get('/car/:id', SellValidator.show, SellController.show);

// EDIT ADS

routes.get('/car/:id/edit', onlyUsers, SellValidator.edit, SellController.editForm);
routes.put('/car', onlyUsers, multer.array('photos', 6), SellValidator.put, SellController.put);
routes.delete('/car', SellController.delete);

module.exports = routes;
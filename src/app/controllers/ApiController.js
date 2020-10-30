const ApiDB = require('../models/api');

module.exports = {
    async get(req, res) {
        const result = await ApiDB.findAll();

        return res.json(result);
    },
};
const SellDB = require('../models/sell');
const AddressDB = require('../models/address');

module.exports = {
    async sellPage(req, res) {
        const fabricators = await SellDB.getFabricators();
        const models = await SellDB.getModels();
        const maxYear = new Date().getUTCFullYear();
        const userAddress = await AddressDB.findOne({ user_id: req.session.userId });
        
        return res.render('sell/sellPage.njk', { fabricators, models, maxYear, userAddress });
    },

    async sellPost(req, res) {
        console.log(req.body);
    },
};
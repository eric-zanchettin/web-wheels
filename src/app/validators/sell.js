const { put } = require('../../routes/sell');
const apiDB = require('../models/api');
const SellDB = require('../models/sell');

module.exports = {
    async sellPost(req, res, next) {
        let { car_model, year, plate_num, } = req.body;

        let avaliableCars = await apiDB.findAll();
        let carsList = avaliableCars.map(car => {
            return car['carname'];
        });

        if (req.files.length == 0) return res.send('You need to send at least one image of your Vehicle!');

        let keys = Object.keys(req.body);
        
        for (key of keys) {
            if (key != 'adressAvailabilityCheck' && (req.body[key] == '' || req.body[key] == 'null')) return res.send('Please, fill all fields!'); 
        };

        if (carsList.indexOf(car_model) == -1) return res.send('Sorry but this car does not exists in our database!');

        let actual = new Date()
        if (year < 1950 || year > actual.getUTCFullYear()) return res.send('Sorry, your vehicle needs to be produced between 1950 and 2020');

        if (plate_num < 0 || plate_num > 9) return res.send("We need only the final number of your car's plate");

        next();
    },

    async show(req, res, next) {
        const carAd = await SellDB.getAdById(req.params.id);

        if (!carAd) return res.send('Ad not found!');

        next();
    },

    async edit(req, res, next) {
        const carAd = await SellDB.getAdById(req.params.id);

        if (!carAd) return res.send('Ad not found!');

        if (carAd.user_id != req.session.userId) return res.send("You are not allowed to edit someone's ad!");
        
        next();
    },

    async put(req, res, next) {
        let { file_length, removed_files, year, plate_num, } = req.body;
        let removedFilesList = removed_files.split(',');
        if (removedFilesList[0] == '') removedFilesList = []

        const keys = Object.keys(req.body);

        for (key of keys) {
            if ((key != 'itens-select' && key != 'removed_files') && (req.body[key] == 'null' || req.body[key] == '')) return res.send('Please, fill all fields!');
        };

        if (removedFilesList.length >= file_length && req.files.length == 0) return res.send('You need to send at least one image of your Vehicle!');

        let actual = new Date()
        if (year < 1950 || year > actual.getUTCFullYear()) return res.send('Sorry, your vehicle needs to be produced between 1950 and 2020');

        if (plate_num < 0 || plate_num > 9) return res.send("We need only the final number of your car's plate");

        next();
    },
};
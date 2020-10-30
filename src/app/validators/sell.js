const api = require('../models/api');
let apiDB = require('../models/api');

module.exports = {
    async sellPost(req, res, next) {
        let { car_model, color, year, km, gas_type, plate_num, carType, ipva, cambium, owner,
            description, itens_array, cep, road, neighborhood, city, complement, reference,
            phone, price, updateOrNot } = req.body;

        let avaliableCars = await apiDB.findAll();
        let carsList = avaliableCars.map(car => {
            return car['carname'];
        });

        if (req.files.length == 0) return res.send('You need to send at least one image of your Vehicle!');

        let keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == '' || req.body[key] == 'null') return res.send('Please, fill all fields!'); 
        };

        if (carsList.indexOf(car_model) == -1) return res.send('Sorry but this car does not exists in our database!');

        if (year < 1950 || year > 2020) return res.send('Sorry, your vehicle needs to be produced between 1950 and 2020');

    },
};
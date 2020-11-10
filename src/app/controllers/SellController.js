const SellDB = require('../models/sell');
const AddressDB = require('../models/address');
const FileDB = require('../models/files');

const utils = require('../../lib/utils');

module.exports = {
    async sellPage(req, res) {
        const fabricators = await SellDB.getFabricators();
        const models = await SellDB.getModels();
        const maxYear = new Date().getUTCFullYear();
        let userAddress = await AddressDB.findOne({ user_id: req.session.userId });

        userAddress = utils.formatData.formatUserInfo(userAddress);
        
        return res.render('sell/sellPage.njk', { fabricators, models, maxYear, userAddress });
    },

    async sellPost(req, res) {
        let {
            car_model, car_year, gas_type, car_type, cambium, color, km, plate_num, ipva, owner, description, itens_array, price,
            cep, neighborhood, complement, phone, road, city, reference, updateOrNot,
        } = req.body

        let files = req.files.map(file => {
            file.path = file.path.replace(/\\/g, '/');
            file.path = file.path.replace('public', '');
            return file;
        });
        
        km = km.replace(/\D/g, '');
        price = price.replace(/\D/g, '');
        
        if (ipva == 'Sim') {
            ipva = 1;
        } else {
            ipva = 0;
        };

        if (owner == 'Sim') {
            owner = 1;
        } else {
            owner = 0;
        };

        sellingData = {
            car_model,
            car_year,
            gas_type,
            car_type,
            cambium,
            color,
            km,
            plate_num,
            ipva,
            owner,
            description,
            itens_array,
            price,
            user_id: req.session.userId,
        };
        
        const ad_id = await SellDB.insert(sellingData, req.session.userId);

        for (file of files) {
            FileDB.insert(file, ad_id);
        };

        if (updateOrNot == 1) {
            cep = cep.replace(/\D/g, '');
            phone = phone.replace(/\D/g, '');

            let updateData = {
                cep,
                neighborhood,
                complement,
                phone,
                road,
                city,
                reference,
            };

            AddressDB.update(updateData, req.session.userId);
        };

        return res.redirect(`/sell/car/${ad_id}`);
    },

    async show(req, res) {
        let carAd = await SellDB.getAdById(req.params.id);
        let carPhotos = await FileDB.getPhotosByAdId(req.params.id);
        let carInfo = utils.formatData.formatAdInfo(carAd);

        return res.render('sell/show.njk', { carInfo, carPhotos });
    },

    async editForm(req, res) {
        let carAd = await SellDB.getAdById(req.params.id);
        let carPhotos = await FileDB.getPhotosByAdId(req.params.id);
        let carInfo = utils.formatData.formatAdInfo(carAd);
        const maxYear = new Date().getUTCFullYear();
        let userAddress = await AddressDB.findOne({ user_id: `${carAd.user_id}` });
        userAddress = utils.formatData.formatUserInfo(userAddress)

        return res.render('sell/editForm.njk', { carInfo, carPhotos, maxYear, userAddress });
    },
};
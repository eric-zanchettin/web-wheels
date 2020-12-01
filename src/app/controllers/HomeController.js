const SellDB = require('../models/sell');
const FileDB = require('../models/files');
const FindDB = require('../models/find');

const { formatData } = require('../../lib/utils');

async function getMainImage(topAds) {
    let adsFilesPromise = topAds.map(ad => {
        let file = FileDB.getPhotoById(ad.id);

        return file;
    });

    let adsFiles = await Promise.all(adsFilesPromise);

    let topAdsWithFiles = topAds.map((ad, index) => {            
        let insertFiles = {
            ...ad,
            file: adsFiles[index],
        };

        return insertFiles;
    });

    return topAdsWithFiles;
};

module.exports = {
    async home(req, res) {
        let topAds = await SellDB.getTopAds();

        let topAdsWithFiles = await getMainImage(topAds);
        
        res.render('home/index.njk', { topAdsWithFiles });
    },

    async find(req, res) {
        const filters = {
            ...req.query,
        };

        let allowed = [
            'car_model',
            'from_caryear',
            'until_caryear',
            'from_km',
            'until_km',
            'from_price',
            'until_price',
            'car_type',
            'cambium',
            'gas_type',
            'color',
            'city',
            'sort',
        ];
        
        const keys = Object.keys(req.query);
        
        const filter = keys
        .filter(key => allowed.includes(key))
        .reduce((obj, key) => {
            obj[key] = req.query[key];
            return obj;
        }, {});

        let { page, limit } = req.query;

        page = page || 1;
        limit = limit || 10;
        offset = (page - 1) * limit;

        const carInfo = await FindDB.findSearched(filter, limit, offset);

        let carInfoWithFiles = await getMainImage(carInfo);
        for (car of carInfoWithFiles) {
            car.price = formatData.formatPrice(car.price);
            car.km = formatData.formatKm(car.km);
        };

        const noRepeatParams = {
            carType: [],
            cambium: [],
            gasType: [],
            color: [],
        };

        carInfoWithFiles.map(car => {
            if (noRepeatParams.carType.indexOf(car.car_type) == -1) {
                noRepeatParams.carType.push(car.car_type)
            };

            if (noRepeatParams.cambium.indexOf(car.cambium) == -1) {
                noRepeatParams.cambium.push(car.cambium)
            };
            
            if (noRepeatParams.gasType.indexOf(car.gas_type) == -1) {
                noRepeatParams.gasType.push(car.gas_type)
            };

            if (noRepeatParams.color.indexOf(car.color) == -1) {
                noRepeatParams.color.push(car.color)
            };
        });

        const totalPages = Math.ceil(carInfo.length / limit);
        
        return res.render('home/find.njk', { filters, noRepeatParams, carInfoWithFiles, page, totalPages, });
    },
};
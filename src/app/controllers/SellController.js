const SellDB = require('../models/sell');
const AddressDB = require('../models/address');
const FileDB = require('../models/files');

const utils = require('../../lib/utils');
const { formatData } = require('../../lib/utils');
const { unlinkSync } = require('fs');

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
        let { cep, neighborhood, complement, phone, road, city, reference, updateOrNot, } = req.body;

        let files = req.files.map(file => {
            file.path = file.path.replace(/\\/g, '/');
            file.path = file.path.replace('public', '');
            return file;
        });

        let sellingData = utils.formatData.formatSellingData(req.body, req.session.userId);
        
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
                user_id: req.session.userId,
                phone
            };

            const hasAdress = await AddressDB.findOne({ user_id: req.session.userId });

            if (!hasAdress) {
                AddressDB.insert(updateData);
            } else {
                AddressDB.update(updateData, req.session.userId);
            };

        };

        return res.redirect(`/sell/car/${ad_id}`);
    },

    async show(req, res) {
        let carAd = await SellDB.getAdById(req.params.id);
        let carPhotos = await FileDB.getPhotosByAdId(req.params.id);
        let carInfo = utils.formatData.formatAdInfo(carAd);

        if (carAd.user_id != req.session.userId) {
            await SellDB.upAccess(req.params.id);
        };

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

    async put(req, res) {
        const { ad_id, removed_files } = req.body;

        let sellingData = formatData.formatSellingData(req.body, req.session.userId);

        try {
            await SellDB.update(sellingData, ad_id);
        } catch (err) {
            console.log(err);
            return res.send('DATABASE INTERNAL ERROR');
        };

        if (req.files.length > 0) {
            let files = req.files.map(file => {
                file.path = file.path.replace(/\\/g, '/');
                file.path = file.path.replace('public', '');
                return file;
            });

            for (file of files) {
                try {
                    await FileDB.insert(file, ad_id);
                } catch (err) {
                    console.log(err);
                    return res.send('DATABASE INTERNAL ERROR');
                };
            };
        };

        let removedFiles = removed_files.split(',');

        if (removed_files) {
            for (removedFileId of removedFiles) {
                let file = await FileDB.getPhotoById(removedFileId);
                file.path = `public${file.path}`
                await unlinkSync(file.path);
                await FileDB.deleteById(removedFileId);
            };
        };

        return res.redirect(`/sell/car/${ad_id}`)
    },

    async delete(req, res) {
        const { ad_id } = req.body;

        const files = await FileDB.getPhotosByAdId(ad_id);
        for (file of files) {
            file.path = `public${file.path}`;
            await unlinkSync(file.path);
        };

        await FileDB.deleteByAdId(ad_id);
        await SellDB.delete(ad_id)

        return res.redirect('/');
    },
};
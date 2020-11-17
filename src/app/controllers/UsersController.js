const { DateRelational } = require('../../lib/utils');
const UserDB = require('../models/users');
const AddressDB = require('../models/address');
const { hash } = require('bcryptjs');

module.exports = {
    async show(req, res) {
        const userData = await UserDB.findOne({id: req.session.userId});

        const userInfo = {
            ...userData,
            nickname: userData.name.substring(0, userData.name.indexOf(' ')),
            birth_dateIso: DateRelational.formatIso(userData.birth_date),
        };

        const userAddress = await AddressDB.findOne({user_id: req.session.userId});

        let post = false
        if (!userAddress) {
            post = true;
        };

        return res.render('users/profile.njk', { userInfo, userAddress, post });
    },

    async post(req, res) {   
        const insertData = {
            ...req.body,
            user_id: req.session.userId,
        };

        await AddressDB.insert(insertData);

        return res.redirect(`/users/account/${req.session.userId}`)
    },

    async put(req, res) {
        const { name, birth_date, cpf_cnpj, cep, road, neighborhood, city, complement, reference, form, } = req.body;

        if (form == 'basicInfo') {
            const data = {
                name,
                birth_date,
                cpf_cnpj,
            };

            await UserDB.update(data, req.session.userId);
        };

        if (form == 'address') {
            const data = {
                cep,
                road,
                neighborhood,
                city,
                complement,
                reference,
            };

            await AddressDB.update(data, req.session.userId);
        };

        return res.redirect(`/users/account/${req.session.userId}`);
    },

    passwordChangeForm(req, res) {
        return res.render('users/passwordChange.njk');
    },

    async changePassword(req, res) {
        let updatePassword = await hash(req.body.newPassword, 8);

        await UserDB.update({ password: updatePassword, }, req.session.userId);

        req.session.destroy();

        return res.redirect('/users/login');
    },

    async info(req, res) {
        const info = await UserDB.findAll();

        return await res.json(info);
    },
};
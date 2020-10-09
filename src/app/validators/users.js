const { compare } = require('bcryptjs');
const UsersDB = require('../models/users');

module.exports = {
    post(req, res, next) {
        const { cep, } = req.body
        
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (key != 'complement' && key != 'reference' && req.body[key] == '') return res.send('Please, fill all required fields!');
        };

        if (cep.length != 8) return res.send('Written ZIP is not valid!');

        next();
    },

    async put(req, res, next) {
        const { form, cpf_cnpj, password, passwordRepeat, cep } = req.body;

        const keys = Object.keys(req.body);

        for (key of keys) {
            if (key != 'complement' && key != 'reference' && req.body[key] == '') return res.send('Please, fill all fields!');
        };

        if (form == 'basicInfo') {
            if (cpf_cnpj.length < 11 || cpf_cnpj.length > 14) return res.send('Written CPF/CNPJ is nos valid!');
            if (passwordRepeat != password) return res.send('Password missmatching!');
            userInfo = await UsersDB.findOne({ id: req.session.userId });
            const passwordCheck = await compare(password, userInfo.password);
            if (!passwordCheck) return res.send('Incorrect Password!');
        };

        if (form == 'address') {
            if (cep.length != 8) return res.send('Written ZIP is not valid!');
        };

        next();
    },

    async changePassword(req, res, next) {
        const { actualPassword, actualPasswordRepeat, newPassword, newPasswordRepeat, } = req.body;

        const keys = Object.keys(req.body);
        
        for (key of keys) {
            if (req.body[key] == '') return res.send('Please, fill all fields!');
        };

        if ((actualPasswordRepeat != actualPassword) || newPasswordRepeat != newPassword) return res.send('Password missmatching!');

        const userInfo = await UsersDB.findOne({ id: req.session.userId });

        if (!userInfo) return res.send('User not Found!');

        const passwordCheck = await compare(actualPassword, userInfo.password);
        if (!passwordCheck) return res.send('Incorret Password!');

        next();
    },
};
const UserDB = require('../models/users');
const { DateRelational } = require('../../lib/utils');

const { compare } = require('bcryptjs');

module.exports = {
    async login(req, res, next) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == '') return res.send('Please, fill all fields!');
        };

        const userFound = await UserDB.findOne(req.body.email);

        if (!userFound) return res.send('User not found!');

        const passwordPass = await compare(req.body.password, userFound.password);

        if (!passwordPass) return res.send('Incorret Password!');

        req.user = userFound;

        next();
    },
    
    async register(req, res, next) {
        const { birth_date, password, password_repeat } = req.body;

        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == '') return res.send('Please, fill all fields!');
        };

        if (password_repeat != password) return res.send('Passwords are mismatching!');

        if (!DateRelational.age(birth_date)) return res.send('You need to have at least 18 Years old to create an Account!');

        next();
    },
};
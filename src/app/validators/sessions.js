const UserDB = require('../models/users');
const { DateRelational } = require('../../lib/utils');

const { compare } = require('bcryptjs');

module.exports = {
    async login(req, res, next) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == '') return res.send('Please, fill all fields!');
        };

        const userFound = await UserDB.findOne({ email: req.body.email });

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

    async forgot(req, res, next) {
        const { email } = req.body;

        if (email == '') return res.send('Please, fill all fields!');

        const userFound = await UserDB.findOne({ email });

        if (!userFound) return res.send('This Email is not registered in WebWheels database!')

        if (userFound.token_expiration >= new Date()) return res.send('An existing Token is awaiting to be redeemed, please, try again later.')
        
        next();
    },

    async reset(req, res, next) {
        const { email, password, passwordRepeat, token } = req.body;

        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == '') return res.send('Please, fill all fields!');
        };

        if (password != passwordRepeat) return res.send('Passwords are mismatching!');

        const userFound = await UserDB.findOne({ email });

        if (!userFound) return res.send('This Email is not registered in WebWheels database!');

        if (!userFound.reset_token || userFound.reset_token == '') return res.send('This Email is not expecting a password reset ...');

        if (userFound.reset_token != token) return res.send('A problem has occurred with your password reset Token! Try again later ...');

        if (userFound.token_expiration < new Date()) return res.send('Your token has expired, try requesting another password reset!');

        next();
    },

    async onlyUsers(req, res, next) {
        (req.session.userId) ? next() : res.render('users/loginForm.njk');
    },
};
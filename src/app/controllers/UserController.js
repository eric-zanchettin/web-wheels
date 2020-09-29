const UserDB = require('../models/users');

module.exports = {
    loginForm(req, res) {
        res.render('users/loginForm.njk');
    },

    async login(req, res) {
        req.session.userId = req.user.id;

        return res.redirect('/');
    },

    registerForm(req, res) {
        res.render('users/registerForm.njk');
    },

    async register(req, res) {
        const userId = await UserDB.insert(req.body);

        req.session.userId = userId;

        return res.redirect('/');
    },

    logout(req, res) {
        req.session.destroy();
        
        return res.redirect('/');
    },
};
const UserDB = require('../models/users');
const mail = require('../../lib/mail');

const crypto = require('crypto');
const { hash } = require('bcryptjs');

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

    forgotForm(req, res) {
        res.render('users/forgotForm.njk');
    },

    async forgot(req, res) {
        const token = crypto.randomBytes(12).toString('hex');

        let now = new Date();
        now = now.setHours( now.getHours() + 1 );

        const updateFields = {
            reset_token: token,
            token_expiration: now,
        };

        const result = await UserDB.findOne(req.body.email);
        const userId = result.id;

        await UserDB.update(updateFields, userId);

        mail.sendMail({
            from: 'support@wehbwheels.com',
            to: req.body.email,
            subject: 'WebWheels - Redefinição de Senha',
            html: `<h1>Olá, ${result.name},</h1>
            <p>Parece que recebemos uma solicitação de Redefinição de Senha da sua conta na WebWheels!</p>
            <p>Caso realmente tenha sido você, por favor, <a href="localhost:3000/users/password-reset?token=${token}">clique aqui</a> para continuar e redefinir sua senha no Site.</p>
            <p>Se não foi você, desconsidere este e-mail e considere trocar a sua senha na WebWheels e nos demais sites em que a utilize.</p>
            <p style="color: rgb(165, 165, 165)">Com imenso prazer, Equipe da WebWheels!</p>
            `
        })

        res.redirect('/');
    },
    async resetForm(req, res) {
        return res.render('users/resetForm.njk', { token: req.query.token, });
    },

    async reset(req, res) {
        let { email, password } = req.body;

        const result = await UserDB.findOne(email);
        const userId = result.id;

        password = await hash(password, 8);

        const updateFields = {
            password,
            reset_token: '',
            token_expiration: '',
        };

        await UserDB.update(updateFields, userId);

        return res.render('users/loginForm.njk');
    },
};
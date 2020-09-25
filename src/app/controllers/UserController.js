module.exports = {
    loginForm(req, res) {
        res.render('users/loginForm.njk');
    },

    async login(req, res) {
        const { email, password } = req.body;
    },
};
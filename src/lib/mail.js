const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "09e97409938639",
      pass: "a79cc1ca8288f3"
    }
  });
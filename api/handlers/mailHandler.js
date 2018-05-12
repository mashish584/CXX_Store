const nodemailer = require("nodemailer");
const html2text = require("html-to-text");

// nodemailer transporter configuration
let transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.HOST_USERNAME,
        pass: process.env.HOST_PASSWORD
    },

    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
});

// send mail to given user
exports.send = options => {
    let mailOptions = {
        from: '"CXX STORE - " <admin@cxxstore.com>',
        to: options.mail,
        subject: options.subject,
        html: options.body,
        text: html2text.fromString(options.body)
    };

    return transporter.sendMail(mailOptions);
};

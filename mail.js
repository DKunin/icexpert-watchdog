'use strict';

var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');

var mailOptionsDef = {
    from: 'Iceexpert@Watchdog.com',
    subject: 'Iceexpert Watchdog'
};

var sendTheMail = function(opts, transporter) {
    var saveOpts = Object.assign(mailOptionsDef, opts);
    transporter.sendMail(saveOpts, error => {
        if (error) {
            throw new Error(error);
        }
    });
};

var mail = function(options) {
    if (!options) {
        options = { auth: {} };
    }
    var auth = options;
    var transporter = nodemailer.createTransport(mg(auth));
    sendTheMail(options, transporter);
};

module.exports = mail;

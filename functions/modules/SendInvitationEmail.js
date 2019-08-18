const functions = require('firebase-functions');
const handlebars = require('handlebars');
const fs = require('fs');
const nodemailer = require('nodemailer');

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

const APP_NAME = 'GoPlan';

const readHTMLFile = (path, callback) => {
  fs.readFile(path, { encoding: 'utf-8' }, (err, html) => {
    if (err) {
      throw err;
    } else {
      callback(null, html);
    }
  });
};

const sendInvitationEmail = async options => {
  const promise = new Promise((resolve, reject) => {
    readHTMLFile('./constants/invitation-email-template.html', (err, html) => {
      if (err) {
        reject(err);
      }
      const template = handlebars.compile(html);
      const replacements = {
        inviterName: options.inviterName,
        inviterEmail: options.inviterEmail,
        invitationLink: `https://www.goplantravelling.com/#/trip/${options.tripId}`,
        tripName: options.tripName,
        tripDates: options.tripDates,
      };
      const htmlToSend = template(replacements);
      resolve(htmlToSend);
    });
  });

  const html = await promise;
  if (!html) {
    return null;
  }
  const mailOptions = {
    from: `${APP_NAME} <GoPlanApp@gmail.com>`,
    to: options.inviteeEmail,
    subject: `Invitation to join ${APP_NAME}!`,
    html,
  };
  mailTransport.sendMail(mailOptions);
  return null;
};

module.exports = functions.https.onCall(options => {
  return sendInvitationEmail(options);
});

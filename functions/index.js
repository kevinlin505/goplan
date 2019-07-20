const functions = require('firebase-functions');
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

async function sendInvitationEmail(email, invitationLink) {
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: email,
  };
  mailOptions.subject = `Invitation to join ${APP_NAME}!`;
  mailOptions.text = `Please join GoPlan. Link: ${invitationLink}`;
  await mailTransport.sendMail(mailOptions);
  return null;
}

exports.sendInvitationEmail = functions.https.onCall(data => {
  return sendInvitationEmail(data.email, data.invitationLink);
});

exports.getAPIKeys = functions.https.onCall(() => {
  return {
    unsplashAccessToken:
      '7110f5de36f381d4394475668a2e656f8100a914a8e73d5b4e6e2d469e15296d',
  };
});

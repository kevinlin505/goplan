'use strict';

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

exports.sendInvitationEmail = functions.https.onCall((data, context) => {
  const email = data.email; 
  const invitationLink = data.invitationLink;

  return sendInvitationEmail(email, invitationLink);
});

// Sends a welcome email to the given user.
async function sendInvitationEmail(email, invitationLink) {
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: email,
  };

  // The user subscribed to the newsletter.
  mailOptions.subject = `Invitation to join ${APP_NAME}!`;
  mailOptions.text = `Please join GoPlan. Link: ${invitationLink}`;
  await mailTransport.sendMail(mailOptions);
  console.log('Invitation email sent to:', email);
  return null;
}

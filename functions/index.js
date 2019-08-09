const deleteReceipts = require('./modules/DeleteReceipts')
const getUnsplashImage = require('./modules/GetUnsplashImage');
const getWeather = require('./modules/GetWeather');
const sendInvitationEmail = require('./modules/SendInvitationEmail');
const uploadReceipt = require('./modules/UploadReceipt');

exports.deleteReceipts = deleteReceipts;
exports.getUnsplashImage = getUnsplashImage;
exports.getWeather = getWeather;
exports.sendInvitationEmail = sendInvitationEmail;
exports.uploadReceipt = uploadReceipt;

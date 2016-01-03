var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tickets = new mongoose.Schema({
	user_id: String,
	qrcode: String,
	number: String
});

module.exports = mongoose.model('Tickets', Tickets);

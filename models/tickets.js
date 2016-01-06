var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tickets = new mongoose.Schema({
	user_id: String,
	email: { type: String, unique: true },
	qrcode: String,
	number: String,
	created: { type: Date, default: Date.now },
	updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tickets', Tickets);
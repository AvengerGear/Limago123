var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tickets = new mongoose.Schema({
	user_id: String,
	email: { type: String, unique: true },
	qrcode: String,
	number: String,
	type: String,
	ip: String,
	internal_ip: String,
	os: String,
	browser: String,
	startTime: String,
	editTime: String,
	sendTime: String,
	allTime: String,
	viewTime: String,
	editingTime: String,
	created: { type: Date, default: Date.now },
	updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tickets', Tickets);

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Visits = new mongoose.Schema({
	type: String,
	qrcode: String,
	ip: String,
	internal_ip: String,
	os: String,
	browser: String,
	created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Visits', Visits);

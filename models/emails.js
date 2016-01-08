var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Emails = new mongoose.Schema({
	email: { type: String, unique: true },
	created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Emails', Emails);

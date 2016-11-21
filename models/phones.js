var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Phones = new mongoose.Schema({
	name: { type: String },
	phone: { type: String, unique: true },
	created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Phones', Phones);

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PageCounter = new mongoose.Schema({
	page_type: String,
	counter: { type: Number, default: 0 }
});

module.exports = mongoose.model('PageCounter', PageCounter);

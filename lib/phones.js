var crypto = require('crypto');
var mongoose = require('mongoose');
var co = require('co');
var Phones = require('../models/phones');

module.exports = {
	create: function(user) {
		return function(done) {

			var _user = new Phones({
				name: user.name,
                phone: user.phone
			});

			_user.save(function(err) {

				done(err, _user);
			});
		};
	},
	getPhones: function(phone) {
		return function(done) {
			Phones.findOne({ phone: phone }, function(err, phone) {
				if (err)
					return done(err);

				if (!phone)
					return done();

				return done(null, phone.toObject());
			});
		};
	}
};

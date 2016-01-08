var crypto = require('crypto');
var mongoose = require('mongoose');
var co = require('co');
var Emails = require('../models/emails');

module.exports = {
	create: function(email) {
		return function(done) {
			co(function *() {
				var _email = new Emails({
					email: email.email
				});

				_email.save(function(err) {

					done(err, _email);
				});
			});

		};
	},
	getEmails: function(email) {
		return function(done) {
			Emails.findOne({ email: email }, function(err, email) {
				if (err)
					return done(err);

				if (!email)
					return done();

				return done(null, email.toObject());
			});
		};
	}
};

var crypto = require('crypto');
var mongoose = require('mongoose');
var co = require('co');
var Tickets = require('../models/tickets');

module.exports = {
	create: function(ticket) {
		return function(done) {
			co(function *() {
				var _ticket = new Tickets({
					user_id: ticket.id,
					email: ticket.email,
					qrcode: ticket.qrcode
				});

				_ticket.save(function(err) {

					done(err, _ticket);
				});
			});

		};
	},
	updateNumberByEmail: function(email, number) {
		return function(done) {

			// Update number
			Tickets.findOneAndUpdate({ email: email }, {
				number: number,
				updated: Date.now()
			}, { new: true }, function(err, ticket) {

				if (err)
					return done(err);

				done(null, ticket ? true : false);
			});
		};
	},
	getNumbers: function(number) {
		return function(done) {
			Tickets.findOne({ number: number }, function(err, ticket) {
				if (err)
					return done(err);

				if (!ticket)
					return done();

				return done(null, ticket.toObject());
			});
		};
	}
};

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
					qrcode: ticket.qrcode,
					number: ticket.number,
					ip: ticket.ip,
					internal_ip: ticket.internal_ip,
					os: ticket.os,
					browser: ticket.browser,
					startTime: ticket.startTime,
					editTime: ticket.editTime,
					sendTime: ticket.sendTime,
					allTime: ticket.allTime,
					viewTime: ticket.viewTime,
					editingTime: ticket.editingTime
				});

				_ticket.save(function(err) {

					done(err, _ticket);
				});
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

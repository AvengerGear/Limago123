var crypto = require('crypto');
var mongoose = require('mongoose');
var co = require('co');
var parser = new UAParser(this.request.header['user-agent']);
var Tickets = require('../models/tickets');

module.exports = {
	create: function(ticket) {
		var parser = new UAParser(this.request.header['user-agent']);

		var ip = this.request.header['x-forwarded-for'];
		var os = parser.getOS().name + ' ' + parser.getOS().version;
		var internal_ip = this.request.body.internal_ip || '';
		var browser = parser.getBrowser().name + ' ' + parser.getBrowser().version;

		return function(done) {
			co(function *() {
				var _ticket = new Tickets({
					user_id: ticket.id,
					email: ticket.email,
					qrcode: ticket.qrcode,
					number: ticket.number,
					ip: ip,
					os: os,
					internal_ip: internal_ip,
					browser: browser
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

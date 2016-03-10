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
	},
	list: function() {

		var conditions = {};
		var columns;
		var opts = {};
		if (arguments.length == 3) {
			conditions = arguments[0];
			columns = arguments[1];
			opts = arguments[2];
		} else if (arguments.length == 2) {
			if (arguments[0] instanceof Array) {
				columns = arguments[0];
				opts = arguments[1];
			} else if (arguments[1] instanceof Array) {
				conditions = arguments[0];
				columns = arguments[1];
			} else {
				conditions = arguments[0];
				opts = arguments[1];
			}
		} else if (arguments.length == 1) {
			columns = null;
			opts = arguments[0];
		}

		return function(done) {

			var cols = null;
			if (columns)
				cols = columns.join(' ');

			Tickets.count(conditions, function(err, count) {
				if (err) {
					done(err);
					return;
				}

				if (!count) {
					done(err, { count: 0 });
					return;
				}

				Tickets.find(conditions, cols, opts, function(err, ticket) {

					done(err, {
						count: count,
						ticket: ticket
					});
				});
			});
		};
	}
};

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
					number: ticket.number
				});

				_ticket.save(function(err) {

					done(err, _ticket);
				});
			});

		};
	}
};

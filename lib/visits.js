var crypto = require('crypto');
var mongoose = require('mongoose');
var co = require('co');
var Visits = require('../models/visits');

module.exports = {
	create: function(visit) {
		return function(done) {
			co(function *() {
				var _visit = new Visits({
					type: visit.type,
					qrcode: visit.qrcode,
					ip: visit.ip,
					internal_ip: visit.internal_ip,
					os: visit.os,
					browser: visit.browser
				});

				_visit.save(function(err) {

					done(err, _visit);
				});
			});

		};
	}
};

var crypto = require('crypto');
//var mongoose = require('mongoose');
var co = require('co');
var PageCount = require('../models/page_count');

module.exports = {
	get: function(pt) {
		return function(done) {
			co(function *() {
				PageCount.findOne({ page_type: pt }, function(err, count) {
					if (err)
						return done(err);

					if (!count)
						return done();

					return done(null, count.toObject());
				});
			});
		};
	},
	update: function(pt, count) {
		return function(done) {
			count = count + 1;

			PageCount.findOneAndUpdate({ page_type: pt }, { counter: count }, { new: true }, function(err, _counter) {

				if (err)
					return done(err);

				done(null, _counter.counter);
			});
		};
	},
	create: function(pt) {
		return function(done) {
			co(function *() {
				var data = {
					page_type: pt.page_type
				};

				var _pageCount = new PageCount(data);

				_pageCount.save(function(err) {

					done(err, _pageCount);
				});
			});
		};
	}
};

var crypto = require('crypto');
var querystring = require('querystring');
var Router = require('koa-router');
var passport = require('koa-passport');
var UAParser = require('ua-parser-js');
var RestPack = require('restpack');
var Member = require('../lib/member');
var Emails = require('../lib/emails');
var Tickets = require('../lib/tickets');
var Visits = require('../lib/visits');
var Passport = require('../lib/passport');
var settings = require('../lib/config.js');

var router = module.exports = new Router();

router.get('/signout', function *() {
	this.logout();
	this.redirect('/');
});

router.post('/signin', function *(next) {
	var ctx = this;

	// Using own user database
	yield passport.authenticate('local', function *(err, user, info) {
		if (err) {
			ctx.status = 500;
			ctx.body = {
				success: false
			};
			return;
		}

		if (!user) {
			ctx.status = 401;
			ctx.body = {
				success: false
			};
			return;
		}

		// Store login information in session
		var m = yield Passport.login(ctx, user);

		// Return result to client
		ctx.body = {
			success: true,
			data: m
		};
	}).call(this, next);
});

router.post('/signup', function *() {
	var username = this.request.body.username || null;
	var name = this.request.body.name || null;
	var phone = this.request.body.phone || null;
	var password = this.request.body.password || null;
	var email = this.request.body.email || null;

	// Sign up via thrid party
	if (this.session.signUpAuthorized) {
		name = this.session.signUpAuthorized.user.name;
		email = this.session.signUpAuthorized.user.email;
	}

	// Create a dataset for restful API
	var restpack = new RestPack();

	var regEx;

	// Feature: unique username was enabled
	if (settings.general.features.uniqueUsername) {
		regEx = /^[a-z0-9-]+$/;
		if (!username) {

			// Empty
			restpack
				.setStatus(RestPack.Status.ValidationFailed)
				.appendError('username', RestPack.Code.Required);
		} else if (!regEx.test(username)) {

			// Invalid
			restpack
				.setStatus(RestPack.Status.ValidationFailed)
				.appendError('username', RestPack.Code.Invalid);
		}
	}

	if (!password) {
		if (!this.session.signUpAuthorized) {
			restpack
				.setStatus(RestPack.Status.ValidationFailed)
				.appendError('password', RestPack.Code.Required);
		} else if (settings.general.features.requiredPassword) {
			restpack
				.setStatus(RestPack.Status.ValidationFailed)
				.appendError('password', RestPack.Code.Required);
		}
	}

	// Check fields
	if (!name || !phone || !password || !email) {
		restpack.setStatus(RestPack.Status.ValidationFailed);

		if (!name)
			restpack.appendError('name', RestPack.Code.Required);

		if (!email)
			restpack.appendError('email', RestPack.Code.Required);

		if (!phone)
			restpack.appendError('phone', RestPack.Code.Required);

		if (!password)
			restpack.appendError('phone', RestPack.Code.Required);
	}

	if (restpack.status == RestPack.Status.ValidationFailed) {
		// Response
		restpack.sendKoa(this);

		return;
	}

	// Check whether user exists or not
	var fields = {
		email: email
	};

	if (settings.general.features.uniqueUsername) {
		fields.username = username;
	}

	try {
		var ret = yield Member.exists(fields);

		if (ret.email) {
			restpack
				.setStatus(RestPack.Status.ValidationFailed)
				.appendError('email', RestPack.Code.AlreadyExist);
		}

		if (settings.general.features.uniqueUsername) {
			if (ret.username) {
				restpack
					.setStatus(RestPack.Status.ValidationFailed)
					.appendError('username', RestPack.Code.AlreadyExist);
			}
		}

		if (restpack.status == RestPack.Status.ValidationFailed) {
			restpack.sendKoa(this);
			return;
		}
	} catch(e) {
		console.log(e);
		this.status = 500;
		return;
	}

	// Create a new member
	var data = {
		name: name,
		phone: phone,
		password: password,
		email: email
	};

	if (settings.general.features.uniqueUsername) {
		data.username = username;
	}

	if (this.session.signUpAuthorized) {
		data.signup_service = this.session.signUpAuthorized.service;
		data[this.session.signUpAuthorized.service] = this.session.signUpAuthorized.user.id;
	}

	try {
		var member = yield Member.create(data);
	} catch(e) {
		console.log(e);
		this.status = 500;
		return;
	}

	// Store login information in session
	var m = yield Passport.login(this, member);

	// Return result to client
	restpack
		.setData(m)
		.sendKoa(this);

	delete this.session.signUpAuthorized;
});

router.post('/signup/email', function *() {
	var email = this.request.body.email || null;

	// Check fields
	if (!email) {
		this.status = 400;
		return;
	}

	// Check whether user exists or not
	try {
		// TODO: It should create a record directly if account was available.
		var ret = yield Emails.getEmails(email);
		if (ret) {
			this.status = 409;
			return;
		}
	} catch(e) {
		console.log(e);
		this.status = 500;
		return;
	}

	// Create a new email
	try {
		var email = yield Emails.create({
			email: email
		});
	} catch(e) {
		console.log(e);
		this.status = 500;
		return;
	}

	// Store login information in session
	// var m = yield Passport.login(this, email);

	// Return result to client
	this.body = {
		success: true
	};
});

router.post('/signup/ticket', function *() {
	var name = this.request.body.name || null;
	var phone = this.request.body.phone || null;
	var password = this.request.body.password || null;
	var email = this.request.body.email || null;
	var qrcode = this.request.body.qrcode || null;
	var type = this.request.body.type || null;
	var startTime = this.request.body.startTime || null;
	var editTime = this.request.body.editTime || null;
	var sendTime = this.request.body.sendTime || null;
	var allTime = this.request.body.allTime || null;
	var viewTime = this.request.body.viewTime || null;
	var editingTime = this.request.body.editingTime || null;

	var parser = new UAParser(this.request.header['user-agent']);
	var ip = this.request.header['x-forwarded-for'] || null;
	var internal_ip = this.request.body.internal_ip || null;
	var os = parser.getOS().name + ' ' + parser.getOS().version || null;
	var browser = parser.getBrowser().name + ' ' + parser.getBrowser().version || null;

	// Check fields
	if (!name || !phone || !password || !email || !qrcode || !type) {
		this.status = 400;
		return;
	}

	// Check whether user exists or not
	try {
		// TODO: It should create a record directly if account was available.
		var ret = yield Member.getMemberByEmail(email);
		if (ret) {
			this.status = 409;
			return;
		}
	} catch(e) {
		console.log(e);
		this.status = 500;
		return;
	}

	// Create a new member
	try {
		var member = yield Member.create({
			name: name,
			phone: phone,
			password: password,
			email: email
		});
	} catch(e) {
		console.log(e);
		this.status = 500;
		return;
	}

	// Store login information in session
	var m = yield Passport.login(this, member);

	// Create a new ticket
	try {
		var ticket = yield Tickets.create({
			user_id: m.id,
			email: email,
			qrcode: qrcode,
			type: type,
			ip: ip,
			internal_ip: internal_ip,
			os: os,
			browser: browser,
			startTime: startTime,
			editTime: editTime,
			sendTime: sendTime,
			allTime: allTime,
			viewTime: viewTime,
			editingTime: editingTime
		});
	} catch(e) {
		console.log(e);
		this.status = 500;
		return;
	}

	// Return result to client
	this.body = {
		success: true,
		data: m
	};
});

router.post('/signup/qrcode', function *() {
	var type = this.request.body.type || null;
	var qrcode = this.request.body.qrcode || null;

	var parser = new UAParser(this.request.header['user-agent']);
	var ip = this.request.header['x-forwarded-for'] || null;
	var internal_ip = this.request.body.internal_ip || null;
	var os = parser.getOS().name + ' ' + parser.getOS().version || null;
	var browser = parser.getBrowser().name + ' ' + parser.getBrowser().version || null;

	// Create a new ticket
	try {
		var ticket = yield Visits.create({
			type: type,
			qrcode: qrcode,
			ip: ip,
			internal_ip: internal_ip,
			os: os,
			browser: browser
		});
	} catch(e) {
		console.log(e);
		this.status = 500;
		return;
	}

	// Return result to client
	this.body = {
		success: true
	};
});

router.get('/auth/github', function *() {
	if (this.query.target)
		this.session.target = this.query.target;

	yield passport.authenticate('github', { scope: [ 'user:email' ] });
});

router.get('/auth/facebook', function *() {
	if (this.query.target)
		this.session.target = this.query.target;

	yield passport.authenticate('facebook', { scope: [ 'email' ] });
});

router.get('/auth/google', function *() {
	if (this.query.target)
		this.session.target = this.query.target;

	yield passport.authenticate('google', { scope: [ 'https://www.googleapis.com/auth/plus.login', 'email' ] });
});

router.get('/auth/linkedin', function *() {
	if (this.query.target)
		this.session.target = this.query.target;

	yield passport.authenticate('linkedin');
});

router.get('/auth/:serviceName/callback', function *() {
	var ctx = this;

	var target = '/';
	if (this.session.target)
		target = this.session.target;

	delete this.session.target;

	try {
		yield passport.authenticate(this.params.serviceName, { failureRedirect: '/signin' }, function *(err, user) {
			if (err)
				throw err;

			if (!user) {
				ctx.redirect(target);
				return;
			}

			// Create a account in our user database
			// Check whether user exists or not
			try {
				var m = yield Member.getMemberByEmail(user.email);
				if (m) {

					// Check if bad guy use user's email to register account on third party service
					if (!m[ctx.params.serviceName]) {

						// Update id which is in third party service
						var data = {};
						data[ctx.params.serviceName] = user.id;
						yield Member.save(m._id, data);
					}

					// Store login information in session
					yield Passport.login(ctx, m);

					// Successful authentication
					ctx.redirect(target);
					return;
				}
			} catch(e) {
				throw e;
			}

			// Feature: unique username was enabled
			if (settings.general.features.uniqueUsername || settings.general.features.requiredPassword) {

				ctx.session.signUpAuthorized = {
					service: ctx.params.serviceName,
					user: user
				};

				ctx.redirect('/signup_setup?' + querystring.stringify({ target: target }));
				return;
			}

			// Create a new member with no password
			try {
				var data = {
					name: user.name,
					email: user.email,
					signup_service: ctx.params.serviceName
				};

				data[ctx.params.serviceName] = user.id;

				var member = yield Member.create(data);
			} catch(e) {
				throw e;
			}

			// Store login information in session
			var m = yield Passport.login(ctx, member);

			// Successful authentication
			ctx.redirect(target);

		});
	} catch(e) {
		console.log(e);
		ctx.status = 500;
		return;
	}
});

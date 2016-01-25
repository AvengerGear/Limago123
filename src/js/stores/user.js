
export default function *() {

	// Getting current state. Initialize state if state doesn't exist.
	var store = this.getState('User', {
		status: 'normal',
		name: 'Nobody',
		username: null,
		phone: null,
		email: null,
		logined: false,
		permissions: {},
		login_time: null,
		avatar_hash: null
	});

	this.on('store.User.syncProfile', function *() {

		try {
			var res = yield this.request
				.get('/user/profile')
				.query();

			if (res.status != 200) {
				return;
			}

			if (res.body.success) {
				// Update store
				var store = this.getState('User');
				store.name = res.body.member.name;
				store.phone = res.body.member.phone;
				store.email = res.body.member.email;
			}

			this.dispatch('state.User');
		} catch(e) {
			console.log(e);
		}
	});

	this.on('store.User.updateProfile', function *(name, phone) {

		try {
			var res = yield this.request
				.post('/user/profile')
				.send({
					name: name,
					phone: phone
				});

			if (res.status != 200) {
				return;
			}

			if (res.body.success) {
				var store = this.getState('User');
				store.name = res.body.member.name;
				store.phone = res.body.member.phone;
				store.email = res.body.member.email;
			}

			this.dispatch('state.User');
		} catch(e) {
			console.log(e);
		}
	});

	this.on('store.User.updatePassword', function *(password, callback) {

		try {
			var res = yield this.request
				.post('/user/password')
				.send({
					password: password
				});

			if (res.status != 200) {
				if (callback)
					return callback('ERR_SERVER', false);

				return;
			}

			if (callback)
				return callback(null, res.body.success);

		} catch(e) {
			if (callback)
				callback('ERR_CONNECT', false);
		}
	});

	this.on('store.User.forgotPassword', function *(email, callback) {

		try {
			var res = yield this.request
				.post('/user/forgot')
				.send({
					email: email
				});

			switch(res.status) {
			case 200:
				if (callback)
					return callback(null, true);

				return;

			default:
				if (callback)
					return callback('ERR_SERVER', false);

				return;
			}

		} catch(e) {
			if (callback)
				callback('ERR_CONNECT', false);
		}
	});

	this.on('store.User.resetPassword', function *(id, token, password, callback) {

		try {
			var res = yield this.request
				.post('/user/reset_password')
				.send({
					id: id,
					token: token,
					password: password
				});

			switch(res.status) {
			case 200:
				if (callback)
					return callback(null, true);

				return;

			default:
				if (callback)
					return callback('ERR_SERVER', false);

				return;
			}

		} catch(e) {
			if (callback)
				callback('ERR_CONNECT', false);
		}
	});

	this.on('store.User.signIn', function *(username, password) {

		var store = this.getState('User');

		try {
			var res = yield this.request
				.post('/signin')
				.send({
					username: username,
					password: password
				});

			// Updating store
			store.status = 'normal';
			store.logined = true;
			store.username = username;
			store.email = username;
			store.name = res.body.data.name;
			store.login_time = res.body.data.login_time;
			store.avatar_hash = res.body.data.avatar_hash;
			store.permissions = res.body.data.permissions;

			this.dispatch('state.User');
		} catch(e) {

			if (e.status == 401) {
				store.status = 'login-failed';

				this.dispatch('state.User');
				return;
			}
		}
	});

	this.on('store.User.signUp', function *(email, phone, password, name) {

		var store = this.getState('User');

		try {
			var res = yield this.request
				.post('/signup')
				.send({
					email: email,
					phone: phone,
					password: password,
					name: name
				});

			switch(res.status) {
			case 200:
				// Updating store
				store.status = 'normal';
				store.logined = true;
				store.name = name;
				store.phone = phone;
				store.username = email;
				store.email = email;
				store.login_time = res.body.data.login_time;
				store.avatar_hash = res.body.data.avatar_hash;
				store.permissions = res.body.data.permissions;
				break;
			}

			this.dispatch('state.User');
		} catch(e) {

			switch(e.status) {
			case 500:
				store.status = 'signup-error';
				break;

			case 409:
				store.status = 'signup-failed-existing-account';
				break;

			case 400:
				store.status = 'signup-failed';
				break;
			}

			this.dispatch('state.User');
		}
	});

	this.on('store.User.signUpEmailOnly', function *(email) {

		var store = this.getState('User');

		try {
			var res = yield this.request
				.post('/signup/email')
				.send({
					email: email
				});

			switch(res.status) {
			case 200:
				// Updating store
				store.status = 'normal';
				store.logined = false;
				break;
			}
			
			this.dispatch('state.User');
		} catch(e) {

			switch(e.status) {
			case 500:
				store.status = 'signup-error';
				break;

			case 409:
				store.status = 'signup-failed-existing-account';
				break;

			case 400:
				store.status = 'signup-failed';
				break;
			}

			this.dispatch('state.User');
		}
	});

	this.on('store.User.signUpWithTicket', function *(email, phone, password, name, qrcode, number, startTime, editTime, sendTime, allTime, viewTime, editingTime) {
		var store = this.getState('User');

		try {
			var res = yield this.request
				.post('/signup/ticket')
				.send({
					email: email,
					phone: phone,
					password: password,
					name: name,
					qrcode: qrcode,
					number: number,
					startTime: startTime,
					editTime: editTime,
					sendTime: sendTime,
					allTime: allTime,
					viewTime: viewTime,
					editingTime: editingTime
				});

			switch(res.status) {
			case 200:
				// Updating store
				store.status = 'normal';
				store.logined = true;
				store.name = name;
				store.phone = phone;
				store.username = email;
				store.email = email;
				store.login_time = res.body.data.login_time;
				store.avatar_hash = res.body.data.avatar_hash;
				store.permissions = res.body.data.permissions;
				break;
			}

			this.dispatch('state.User');
		} catch(e) {

			switch(e.status) {
			case 500:
				store.status = 'signup-error';
				break;

			case 409:
				store.status = 'signup-failed-existing-account';
				break;

			case 400:
				store.status = 'signup-failed';
				break;
			}

			this.dispatch('state.User');
		}
	});

	this.on('store.User.copyToSignUp', function *(email, phone, name) {
		var store = this.getState('User');

		store.name = name;
		store.phone = phone;
		store.email = email;

		this.dispatch('state.User');
	});

	this.on('store.User.resetStatus', function *() {
		var store = this.getState('User');

		store.status = 'reset';

		this.dispatch('state.User');
	});
};

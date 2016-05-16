
export default function *() {

	// Getting current state. Initialize state if state doesn't exist.
	var AdminUsers = this.getState('Admin.Users', {
		page: 1,
		pageCount: 1,
		perPage: 100,
		users: []
	});

	this.on('store.Admin.Users.query', function *(conditions) {

		var state = this.getState('Admin.Users');

		// Getting user list by calling API
		var resUsers = yield this.request
			.get('/admin/api/users')
			.query({
				page: state.page,
				pageCount: state.pageCount,
				perPage: state.perPage,
				q: JSON.stringify(conditions)
			});

		var	resTickets = [];
		resTickets = yield this.request
			.get('/admin/api/tickets')
			.query({
				q: JSON.stringify(conditions)
			});

		if (resUsers.status != 200 && resUsers.status != 200) {
			return;
		}

		var users = resUsers.body.members;
		var tickets = resTickets.body.tickets;

		if (resTickets.length) {
			tickets.forEach(function(item) {
				var ticket = item;

				users.forEach(function(user) {
					if (ticket.email == user.email) {
						user.ticket = ticket;
					}
				});
			});
		}
		
		// Update state
		state.users = users;
		state.page = resUsers.body.page;
		state.pageCount = resUsers.body.pageCount;
		state.perPage = resUsers.body.perPage;

		this.dispatch('state.Admin.Users');
	});

	this.on('store.Admin.Users.deleteOne', function *(id) {

		var state = this.getState('Admin.Users');

		// Getting user list by calling API
		var res = yield this.request
			.del('/admin/api/users/' + id)
			.query();

		if (res.status != 200) {
			return;
		}

		// Remove users on store
		for (var index in state.users) {
			var user = state.users[index];

			if (id = user._id) {
				state.users.splice(index, 1);
				break;
			}
		}

		this.dispatch('state.Admin.Users');
	});
};

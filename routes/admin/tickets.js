var Router = require('koa-router');
var Tickets = require('../../lib/tickets');
var Middleware = require('../../lib/middleware');

var router = module.exports = new Router();

router.use(Middleware.allow('admin.users'));

router.get('/admin/api/tickets', function *() {

	var q = {};
	try {
		q = JSON.parse(this.request.query.q);
	} catch(e) {}

	var conditions = {};
	if (q.email) {
		conditions.email = new RegExp(q.email, 'i');
	}
	if (q.token) {
		conditions.tokens = new RegExp(q.token, 'i');
	}

	// Fetching a list with specific condition
	var data = yield Tickets.list(conditions, [
		'email',
		'qrcode',
		'number',
		'ip',
		'internal_ip',
		'os',
		'browser',
		'allTime',
		'viewTime',
		'editingTime'
	]);

	this.body = {
		tickets: data.ticket
	};
});

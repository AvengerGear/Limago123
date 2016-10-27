var hotpot = require('hotpot');
var LandingPage = require('./components/LandingPage.jsx');
var LandingPageEmailOnly = require('./components/LandingPageEmailOnly.jsx');
var ForgotPage = require('./components/ForgotPage.jsx');
var SignInPage = require('./components/SignInPage.jsx');
var SignUpPage = require('./components/SignUpPage.jsx');
var SignUpWithTicket = require('./components/SignUpWithTicket.jsx');
var StudentWithTicket = require('./components/StudentWithTicket.jsx');
var EmployeeWithTicket = require('./components/EmployeeWithTicket.jsx');
var RetiredWithTicket = require('./components/RetiredWithTicket.jsx');
var getTicket = require('./components/getTicket.jsx');
var SettingsPage = require('./components/SettingsPage.jsx');
var NotFoundPage = require('./components/NotFoundPage.jsx');
var ResetPasswordPage = require('./components/ResetPasswordPage.jsx');

module.exports = [
	{
		path: '/404',
		handler: NotFoundPage
	},
	{
		path: '/',
		handler: LandingPageEmailOnly
	},
	{
		path: '/signin',
		handler: SignInPage
	},
	{
		path: '/forgot',
		handler: ForgotPage
	},
	{
		path: '/reset_password/:userid/:token',
		handler: ResetPasswordPage
	},
	{
		path: '/signup',
		getHandler: function(nextState, done) {
			require.ensure([], function(require) {
				done(null, require('./components/SignUpPage.jsx'));
			});
		}
	},
	{
		path: '/demoThree/:type',
		handler: require('./components/DemoThree.jsx')
	},
	{
		path: '/demoFour/:type',
		handler: require('./components/demoFour.jsx')
	},
	{
		path: '/student/:qrcode',
		handler: StudentWithTicket
	},
	{
		path: '/employee/:qrcode',
		handler: EmployeeWithTicket
	},
	{
		path: '/retired/:qrcode',
		handler: RetiredWithTicket
	},
	{
		path: '/getticket/:qrcode',
		handler: SignUpWithTicket
	},
	{
		path: '/complete/getticket',
		handler: getTicket
	},
	{
		path: '/signup_setup',
		getHandler: function(nextState, done) {
			require.ensure([], function(require) {
				done(null, require('./components/SignUpSetupPage.jsx'));
			});
		}
	},
	{
		path: '/settings',
		redirect: '/settings/profile'
	},
	{
		path: '/settings/:category',
		handler: SettingsPage
	},
	{
		allow: 'admin.access',
		path: '/admin',
		redirect: '/admin/dashboard'
	},
	{
		allow: 'admin.access',
		path: '/admin/dashboard',
		getHandler: function(nextState, done) {
			require.ensure([], function(require) {
				done(null, require('./components/Admin/Dashboard.jsx'));
			});
		}
	},
	{
		allow: 'admin.users',
		path: '/admin/users',
		getHandler: function(nextState, done) {
			require.ensure([], function(require) {
				done(null, require('./components/Admin/Users.jsx'));
			});
		}
	},
	{
		allow: 'admin.users',
		path: '/admin/users/user/:userid',
		getHandler: function(nextState, done) {
			require.ensure([], function(require) {
				done(null, require('./components/Admin/User.jsx'));
			});
		}
	},
	{
		allow: 'admin.roles',
		path: '/admin/roles',
		getHandler: function(nextState, done) {
			require.ensure([], function(require) {
				done(null, require('./components/Admin/Roles.jsx'));
			});
		}
	},
	{
		allow: 'admin.roles',
		path: '/admin/roles/role/:roleid',
		getHandler: function(nextState, done) {
			require.ensure([], function(require) {
				done(null, require('./components/Admin/Role.jsx'));
			});
		}
	},
	{
		allow: 'admin.users',
		path: '/admin/record/first',
		getHandler: function(nextState, done) {
			require.ensure([], function(require) {
				done(null, require('./components/Admin/TicketFirstRecord.jsx'));
			});
		}
	}
	,
	{
		allow: 'admin.users',
		path: '/admin/record/second',
		getHandler: function(nextState, done) {
			require.ensure([], function(require) {
				done(null, require('./components/Admin/TicketSecondRecord.jsx'));
			});
		}
	}
];

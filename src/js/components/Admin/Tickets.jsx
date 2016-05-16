import crypto from 'crypto';
import React from 'react';
import { Link } from 'react-router';

import I18n from 'Extension/I18n.jsx';

// Components
import AdminLayout from './AdminLayout.jsx';
import Avatar from '../Avatar.jsx';

// Decorators
import { router, flux, i18n, preAction } from 'Decorator';


@flux
@i18n
@router
class UserItem extends React.Component {

	componentDidMount = () => {
		$(this.refs.dropdown).dropdown();
	};

	deleteUser = () => {
		this.flux.dispatch('action.Admin.Users.deleteOne', this.props.id);
	};

	render() {
		var avatar_hash = crypto.createHash('md5').update(this.props.email).digest('hex');

console.log(this.props)

		return (
			<tr>
				<td>{this.props.name}</td>
				<td>{this.props.email}</td>
				<td>{this.props.phone}</td>
				<td>{this.props.people}</td>
				<td>{this.props.price} 0%</td>
				<td>{this.props.times} hour</td>
				<td>{this.props.os}</td>
				<td>{this.props.allTime} sec</td>
				<td>{this.props.viewTime} sec</td>
				<td>{this.props.editingTime} sec</td>
				<td>{this.props.created.split('T')[0]}</td>
			</tr>
		);
	}
}

@flux
@i18n
@preAction((handle) => {
	handle.doAction('Admin.Users.query');
})
class Tickes extends React.Component {

	constructor(props, context) {
		super(props, context);

		var state = this.flux.getState('Admin.Users');

		this.state = {
			users: state.users,
			page: state.page,
			pageCount: state.pageCount,
			perPage: state.perPage,
			busy: false,
		};
	}

	componentWillMount = () => {
		this.flux.on('state.Admin.Users', this.flux.bindListener(this.onChange));
		this.flux.on('state.Admin.Tickets', this.flux.bindListener(this.onChange));
	};

	componentWillUnmount = () => {
		this.flux.off('state.Admin.Users', this.onChange);
		this.flux.off('state.Admin.Tickets', this.onChange);
	};

	onChange = () => {
		var state = this.flux.getState('Admin.Users');

		this.setState({
			users: state.users,
			page: state.page,
			pageCount: state.pageCount,
			perPage: state.perPage,
			busy: false
		});
	};

	updateProfile = () => {
		if (this.state.busy)
			return;

		this.setState({
			busy: true
		});

		this.flux.dispatch('action.User.updateProfile', this.state.name);
	};

	render() {
		var ticketData = this.flux.getState('Tickets').data;
		var users = [];

		if (users.lebgth) {
			for (var index in this.state.users) {
				var user = this.state.users[index];

				ticketData.forEach(function(data) {
					if (user.ticket.qrcode === data.qrcode) {
						user.ticket.people = data.people;
						user.ticket.price = data.price;
						user.ticket.times = data.times;
					}
				});

				users.push(
					<UserItem
						id={user._id}
						name={user.name}
						email={user.email}
						phone={user.phone}
						created={user.created}
						people={user.ticket.people || null}
						price={user.ticket.price || null}
						times={user.ticket.times || null}
						os={user.ticket.os || null}
						allTime={user.ticket.allTime || null}
						editingTime={user.ticket.editingTime || null}
						viewTime={user.ticket.viewTime || null}
						key={index} />
				);
			}
		}

		return (
			<AdminLayout category='tickets'>
				<div className='ui basic segment'>

					<div className='ui stackable grid'>
						<div className='four wide computer sixteen wide tablet column'>
							<h1 className='ui header'>
								<i className='payment icon' />
								<div className='content'>
									Tickets
									<div className='sub header'>
										Tickets Management
									</div>
								</div>
							</h1>
						</div>
					</div>


					<table className='ui attached striped table'>
						<thead>
							<tr>
								<th>Name</th>
								<th>E-mail</th>
								<th>Phone</th>
								<th>People</th>
								<th>Price</th>
								<th>Time</th>
								<th>OS</th>
								<th>Totale Time</th>
								<th>View Time</th>
								<th>Edit Time</th>
								<th>Registered</th>
							</tr>
						</thead>
						<tbody>
							{users}
						</tbody>
					</table>

				</div>
			</AdminLayout>
		);
	}
}

export default Tickes;

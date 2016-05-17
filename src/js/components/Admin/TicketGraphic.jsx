import crypto from 'crypto';
import React from 'react';
import moment from 'moment';
import { Link } from 'react-router';

import I18n from 'Extension/I18n.jsx';

// Components
import AdminLayout from './AdminLayout.jsx';

// Decorators
import { router, flux, i18n, preAction, wait } from 'Decorator';


@flux
@i18n
@router
class FirstTicketItem extends React.Component {
	formateDate = (date) => {
		return moment(date).format('YYYY/MM/DD HH:mm');
	};

	render() {
		return (
			<tr>
				<td>{Number(this.props.id) + 1}</td>
				<td>{this.props.name}</td>
				<td>{this.props.email}</td>
				<td>{this.props.phone}</td>
				<td>{this.props.people}</td>
				<td>{this.props.price}0%</td>
				<td>{this.props.times}H</td>
				<td>{this.props.os}</td>
				<td>{this.props.allTime} sec</td>
				<td>{this.props.viewTime} sec</td>
				<td>{this.props.editingTime} sec</td>
				<td>{this.formateDate(this.props.created.$date)}</td>
			</tr>
		);
	}
}

@flux
@i18n
@preAction((handle) => {
	handle.doAction('Admin.Users.graphic');
})
@wait('Admin.Users')
class TicketGraphic extends React.Component {

	constructor(props, context) {
		super(props, context);

		var state = this.flux.getState('Admin.Users');

		this.state = {
			users: state.users,
			record: state.record,
			page: state.page,
			pageCount: state.pageCount,
			perPage: state.perPage,
			busy: false,
		};
	}

	componentWillMount = () => {
		this.flux.on('state.Admin.Users', this.flux.bindListener(this.onChange));
		this.flux.on('state.Tickets', this.flux.bindListener(this.onChange));
	};

	componentWillUnmount = () => {
		this.flux.off('state.Admin.Users', this.onChange);
		this.flux.off('state.Tickets', this.onChange);
	};

	onChange = () => {
		var state = this.flux.getState('Admin.Users');

		this.setState({
			users: state.users,
			record: state.record,
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
		var firstUsers = [];
		var firstUserData = this.state.record.firstRecord;


// console.log('ticketData', ticketData)
console.log('record', firstUserData)




		for (var tIndex in firstUserData.tickets) {
			var ticket = firstUserData.tickets[tIndex];
			ticketData.forEach(function(data) {
				if (ticket.qrcode === data.qrcode) {
					ticket.people = data.people;
					ticket.price = data.price;
					ticket.times = data.times;
				}
			});

			for (var mIndex in firstUserData.members) {
				var user = firstUserData.members[mIndex];
				if (user.email == ticket.email) {
					ticket.userName = user.name;
					ticket.userPhone = user.phone;
				}
			}

			firstUsers.push(
				<FirstTicketItem
					id={tIndex}
					name={ticket.userName}
					email={ticket.email}
					phone={ticket.userPhone}
					created={ticket.created}
					people={ticket.people || null}
					price={ticket.price || null}
					times={ticket.times || null}
					os={ticket.os || null}
					allTime={ticket.allTime || null}
					editingTime={ticket.editingTime || null}
					viewTime={ticket.viewTime || null}
					key={tIndex} />
			);
		}

		return (
			<AdminLayout category='tickets'>
				<div className='ui basic segment'>

					<div className='ui stackable grid'>
						<div className='ten wide computer sixteen wide tablet column'>
							<h1 className='ui header'>
								<i className='payment icon' />
								<div className='content'>
									Tickets (1st)
									<div className='sub header'>
										<div className="ui large horizontal list">
											<div className="item">
												<div className="content">
													<div className="header">January</div>
												</div>
											</div>
											<div className="item">
												<div className="content">
													<div className="header"><div className="ui teal label">Total Emails: {firstUserData.emails.length}</div></div>
												</div>
											</div>
											<div className="item">
												<div className="content">
													<div className="header"><div className="ui teal label">Total Tickets: {firstUserData.tickets.length}</div></div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</h1>
						</div>
					</div>

					<div className='ui stackable grid'>
						<div className="column">
							<table className='ui attached striped table'>
								<thead>
									<tr>
										<th></th>
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
									{firstUsers}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</AdminLayout>
		);
	}
}

export default TicketGraphic;

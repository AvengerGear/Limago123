import crypto from 'crypto';
import React from 'react';
import moment from 'moment';
import { Link } from 'react-router';

import I18n from 'Extension/I18n.jsx';

// Components
import AdminLayout from './AdminLayout.jsx';

// Decorators
import { router, flux, i18n } from 'Decorator';

class RecordOS extends React.Component {
	constructor(props, context) {
		super(props, context);

		var labels = [];
		var series = [];

		for (var index in props.data) {
			var osItem = props.data[index];
			var os = osItem.split(' ');

			if (labels.indexOf(os[0]) === -1) {
				labels.push(os[0]);
				series.push(1)
			} else {
				series[labels.indexOf(os[0])] = series[labels.indexOf(os[0])] + 1;
			}
		}

		this.state = {
			labels: labels,
			series: series
		};
	}

	componentWillReceiveProps = (nextProps) => {
		var labels = [];
		var series = [];

		for (var index in nextProps.data) {
			var osItem = nextProps.data[index];
			var os = osItem.split(' ');

			if (labels.indexOf(os[0]) === -1) {
				labels.push(os[0]);
				series.push(1)
			} else {
				series[labels.indexOf(os[0])] = series[labels.indexOf(os[0])] + 1;
			}
		}

		this.setState({
			labels: labels,
			series: series
		});
	};

	componentDidMount = () => {
		var data = {labels: this.state.labels, series: this.state.series};
		var options = {
			width: 300,
			labelInterpolationFnc: function(value) {
				return value[0]
			}
		};
		var responsiveOptions = [
			['screen and (min-width: 640px)', {
				chartPadding: 30,
				labelOffset: 50,
				labelDirection: 'explode',
				labelInterpolationFnc: function(value) {
					return value;
				}
			}],
			['screen and (min-width: 1024px)', {
				labelOffset: 35,
				chartPadding: 15
			}]
		];
		new Chartist.Pie(this.refs.pieChart, data, options, responsiveOptions);
	};

	render() {
		var tableValue = [];
		for (var index in this.state.labels) {
			var label = this.state.labels[index];

			tableValue.push(
				<tr>
					<td>{label}</td>
					<td>{this.state.series[index]}</td>
				</tr>
			);
		}

		return (
			<div className='ui grid'>
				<div className='eight wide column'>
					<div ref="pieChart"></div>
				</div>
				<div className='four wide column'>
					<table className='ui attached striped table'>
						<tbody>
							{tableValue}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}

class SecondTicketItem extends React.Component {
	formateDate = (date) => {
		return moment(date).format('YYYY/MM/DD HH:mm');
	};

	showStyle = (style) => {
		if (style == '786a9d01278af5dd') {
			return 'Photo'
		}
		if (style == '782e61c302e1e614') {
			return 'Graphic'
		}

	};

	render() {
		return (
			<tr>
				<td>{Number(this.props.id) + 1}</td>
				<td>{this.props.name}</td>
				<td>{this.props.email}</td>
				<td>{this.props.phone}</td>
				<td className="text-center">{this.showStyle(this.props.qrcode)}</td>
				<td className="text-center">{this.props.os}</td>
				<td className="text-center">{this.props.allTime} sec</td>
				<td className="text-center">{this.props.viewTime} sec</td>
				<td className="text-center">{this.props.editingTime} sec</td>
				<td>{this.formateDate(this.props.created.$date)}</td>
			</tr>
		);
	}
}

@flux
class TicketSecondRecord extends React.Component {

	constructor(props, context) {
		super(props, context);

		this.state = {
			ticketData: this.flux.getState('Tickets').data,
			recordData: this.flux.getState('Admin.Record').secondRecord
		};
	}

	componentWillMount = () => {
		this.flux.on('state.Tickets', this.flux.bindListener(this.onChange));
		this.flux.on('state.Admin.Record', this.flux.bindListener(this.onChange));
	};

	componentWillUnmount = () => {
		this.flux.off('state.Tickets', this.onChange);
		this.flux.off('state.Admin.Record', this.onChange);
	};

	onChange = () => {
		this.setState({
			ticketData: this.flux.getState('Tickets').data,
			recordData: this.flux.getState('Admin.Record').secondRecord
		});
	};

	render() {
		var ticketData = this.state.ticketData;
		var secondUserData = this.state.recordData;
		var firstUsers = [];
		var ticketOS = [];
		var visitOS = [];

		for (var tIndex in secondUserData.tickets) {
			var ticket = secondUserData.tickets[tIndex];
			
			ticketOS.push(secondUserData.tickets[tIndex].os);

			ticketData.forEach(function(data) {
				if (ticket.qrcode === data.qrcode) {
					ticket.people = data.people;
					ticket.price = data.price;
					ticket.times = data.times;
					data.count = data.count + 1;
				}
			});

			for (var mIndex in secondUserData.members) {
				var user = secondUserData.members[mIndex];
				if (user.email == ticket.email) {
					ticket.userName = user.name;
					ticket.userPhone = user.phone;
				}
			}

			firstUsers.push(
				<SecondTicketItem
					id={tIndex}
					name={ticket.userName}
					email={ticket.email}
					phone={ticket.userPhone}
					created={ticket.created}
					qrcode={ticket.qrcode || null}
					os={ticket.os || null}
					allTime={ticket.allTime || null}
					editingTime={ticket.editingTime || null}
					viewTime={ticket.viewTime || null}
					key={tIndex} />
			);
		}

		for (var index in secondUserData.visits) {
			visitOS.push(secondUserData.visits[index].os);
		}
		
		return (
			<AdminLayout category='secondRecord'>
				<div className='ui basic segment'>
					<div className='ui stackable grid'>
						<div className='ten wide computer sixteen wide tablet column'>
							<h1 className='ui header'>
								<i className='payment icon' />
								<div className='content'>
									Second Record
									<div className='sub header'>
										<div className="ui large horizontal list">
											<div className="item">
												<div className="content">
													<div className="header">April</div>
												</div>
											</div>
											<div className="item">
												<div className="content">
													<div className="header"><div className="ui teal label">Total Emails: {secondUserData.emails.length}</div></div>
												</div>
											</div>
											<div className="item">
												<div className="content">
													<div className="header"><div className="ui teal label">Total Tickets: {secondUserData.tickets.length}</div></div>
												</div>
											</div>
											<div className="item">
												<div className="content">
													<div className="header"><div className="ui teal label">Total Visits: {secondUserData.visits.length}</div></div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</h1>
						</div>
					</div>

					<div className='ui stackable grid'>
						<div className='column'>
							<div className='ui stackable grid'>
								<div className='eight wide column'>
									<h2>Visits</h2>
									<RecordOS data={visitOS} />
								</div>
								<div className='eight wide column'>
									<h2>Sign up with Numbers</h2>
									<RecordOS data={ticketOS} />
								</div>
							</div>
						</div>
					</div>

					<div className='ui stackable grid'>
						<div className="column">
							<h2>Sign up with Numbers: {secondUserData.tickets.length}</h2>
							<table className='ui attached striped table'>
								<thead>
									<tr>
										<th></th>
										<th>Name</th>
										<th>E-mail</th>
										<th>Phone</th>
										<th className="text-center">Style</th>
										<th className="text-center">OS</th>
										<th className="text-center">Totale Time</th>
										<th className="text-center">View Time</th>
										<th className="text-center">Edit Time</th>
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

export default TicketSecondRecord;

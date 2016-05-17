import crypto from 'crypto';
import React from 'react';
import moment from 'moment';
import { Link } from 'react-router';

import I18n from 'Extension/I18n.jsx';

// Components
import AdminLayout from './AdminLayout.jsx';

// Decorators
import { router, flux, i18n } from 'Decorator';

class FirstRecordPackages extends React.Component {
	constructor(props, context) {
		super(props, context);

		var labels = [];
		var series = [];
		var seriesData = [];

		for (var index in props.data) {
			var packageItem = props.data[index];

			labels.push(
				// 'people: ' + props.data[index].people + ' price: ' + props.data[index].price + '0%' + ' times: ' + props.data[index].times + 'H'
				'no. ' + (Number(index) + 1)
			);

			if (packageItem.count) {
				seriesData.push(packageItem.count);
			}else {
				seriesData.push(0);
			}
		}
		labels.reverse();
		seriesData.reverse();
		series.push(seriesData);

		this.state = {
			labels: labels,
			series: series
		};
	}

	componentDidMount = () => {
		var data = {labels: this.state.labels, series: this.state.series};
		var options = {
			seriesBarDistance: 15,
			height: 1000,
			horizontalBars: true,
			axisX: {
				onlyInteger: true
			}
		};
		new Chartist.Bar(this.refs.barChart, data, options);
	};

	render() {

		return (
			<div>
				<div ref="barChart"></div>
			</div>
		);
	}
}

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
				<td className="text-center">{this.props.people}</td>
				<td className="text-center">{this.props.price}0%</td>
				<td className="text-center">{this.props.times}H</td>
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
class TicketGraphic extends React.Component {

	constructor(props, context) {
		super(props, context);

		this.state = {
			ticketData: this.flux.getState('Tickets').data,
			recordData: this.flux.getState('Admin.Record')
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
			recordData: this.flux.getState('Admin.Record')
		});
	};

	render() {
		var ticketData = this.state.ticketData;
		var firstUserData = this.state.recordData.firstRecord;
		var firstUsers = [];

		for (var tIndex in firstUserData.tickets) {
			var ticket = firstUserData.tickets[tIndex];
			ticketData.forEach(function(data) {
				if (ticket.qrcode === data.qrcode) {
					ticket.people = data.people;
					ticket.price = data.price;
					ticket.times = data.times;
					data.count = data.count + 1;
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

		var packages = [];
		for (var index in ticketData) {
			var packageItem = ticketData[index];
			packages.push(
				<tr>
					<td className="text-center">No.{Number(index) + 1}</td>
					<td className="text-center">{ticketData[index].people}</td>
					<td className="text-center">{ticketData[index].price}0%</td>
					<td className="text-center">{ticketData[index].times}H</td>
				</tr>
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
						<div className='column'>
							<div className='ui stackable grid'>
								<div className='four wide column'>
									<table className='ui attached striped table'>
										<thead>
											<tr>
												<th></th>
												<th className="text-center">People</th>
												<th className="text-center">Price</th>
												<th className="text-center">Time</th>
											</tr>
										</thead>
										<tbody>
											{packages}
										</tbody>
									</table>
								</div>
								<div className='ten wide column'>
									<FirstRecordPackages data={ticketData} />
								</div>
							</div>
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
										<th className="text-center">People</th>
										<th className="text-center">Price</th>
										<th className="text-center">Time</th>
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

export default TicketGraphic;

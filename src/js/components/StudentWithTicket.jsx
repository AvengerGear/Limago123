import React from 'react';
import ReactDOM from 'react-dom';
import I18n from 'Extension/I18n.jsx';
import moment from 'moment';

// Decorators
import { router, flux, i18n } from 'Decorator';

// Components
import Header from './Header.jsx';
import Footer from './Footer.jsx';

//images
import ticket from 'Source/images/ticket.jpg';

// icons
import arrow from 'Source/images/arrow.png';
import pen from 'Source/images/pen.png';

var sectionStyle = {
	paddingTop: '40px',
	paddingBottom: '50px'
};

var bannerStyle = {
	minHeight: '600px'
};

var joinBtnStyle = {
	marginTop: '50px',
};

var stepStyle = {
	marginTop: '30px',
	paddingLeft: '5%'
};

var lableStyle = {
	textAlign: 'left'
};

@router
@flux
class StudentWithTicketPage extends React.Component {
	constructor() {
		super();

		this.state = {
			error: false,
			email_existing_error: false,
			email_error: false,
			email_empty_error: false,
			confirm_error: false,
			password_error: false,
			password_empty_error: false,
			name_error: false,
			name_empty_error: false,
			phone_error: false,
			phone_empty_error: false,
			qrcode: null,
			people: '',
			price: '',
			times: '',
			step1_status: 'active',
			timer_start: null,
			timer_edit: null,
			isEdit: false,
			timer_send: null
		};
	}

	componentWillMount = () => {
		this.flux.on('state.User', this.flux.bindListener(this.onChange));
	}

	componentWillUnmount = () => {
		this.flux.off('state.User', this.onChange);
	}

	componentDidMount = () => {
		var url = window.location.pathname;
		var urlArrs = url.split('/');
		var tickets = this.flux.getState('Tickets').data;
		var isQrcode = false;
		var currentTime = new Date();
		var state = {
			type: urlArrs[1],
			qrcode: urlArrs[2],
			timer_start: currentTime
		};

		tickets.forEach(ticket => {
			if (urlArrs[2] == ticket.qrcode) {
				isQrcode = true;
			}
		});

		if (!isQrcode) {
			this.history.pushState(null, '/');
			return;
		}

		this.flux.dispatch('action.User.saveVisitPage',
			state.type, state.qrcode
		);

		this.setState(state);
	}

	signUp = () => {
		var type = this.state.type;
		var qrcode = this.state.qrcode;
		var email = this.refs.email.value.trim();
		var phone = this.refs.phone.value.trim();
		var name = this.refs.name.value.trim();
		var password = this.refs.password.value;
		var confirm_password = this.refs.confirm_password.value;
		var currentTime = new Date();

		var state = {
			error: false,
			email_error: false,
			email_empty_error: false,
			confirm_error: false,
			password_error: false,
			password_empty_error: false,
			name_error: false,
			name_empty_error: false,
			phone_error: false,
			phone_empty_error: false
		};

		if (email == '') {
			state.error = true;
			state.email_error = true;
			state.email_empty_error = true;
		}

		if (name == '') {
			state.error = true;
			state.name_error = true;
			state.name_empty_error = true;
		}

		if (phone == '') {
			state.error = true;
			state.phone_error = true;
			state.phone_empty_error = true;
		}

		if (password == '') {
			state.error = true;
			state.password_error = true;
			state.password_empty_error = true;
			state.confirm_error = true;
		}

		// Two passwords should be the same
		if (password != confirm_password) {
			state.error = true;
			state.confirm_error = true;
		}

		if (qrcode == '' || type =='') {
			state.error = true;
		}

		// Something's wrong
		if (state.error) {
			this.setState(state);
			return;
		}

		var allTime = moment(currentTime).diff(this.state.timer_start, 'seconds');
		var viewTime = moment(this.state.timer_edit).diff(this.state.timer_start, 'seconds');
		var editingTime = moment(currentTime).diff(this.state.timer_edit, 'seconds');

		// Sign up now
		this.flux.dispatch('action.User.signUpWithTicket',
			this.refs.email.value,
			this.refs.phone.value,
			this.refs.password.value,
			this.refs.name.value,
			qrcode,
			type,
			this.state.timer_start,
			this.state.timer_edit,
			currentTime,
			allTime,
			viewTime,
			editingTime
		);
	}

	joinUs = () => {
		var $node = $(this.refs.app_section);
		var $joinUs = $(ReactDOM.findDOMNode(this.refs.joinUs));

		$('html, body').stop().animate({
			scrollTop: $node.offset().top - $joinUs.height() - 150
		}, 400);
	}

	showTicket = () => {
		$('#show-ticket').toggleClass('hide');
	}

	stepStatus = () => {
		var status = {step1_status: 'active'};

		if (this.refs.number.value.length == 16) {
			status.step1_status = 'completed';
		}

		this.setState(status);
	}

	saveEditTime = () => {
		if (!this.state.isEdit) {
			var currentTime = new Date();

			this.setState({
				timer_edit: currentTime,
				isEdit: true
			});
		}
	}

	onChange = () => {
		var user = this.flux.getState('User');

		// No need to sign in if logined already
		if (user.logined) {
			this.history.pushState(null, '/complete/getticket');
			return;
		}

		var userData = {
			'name': user.name,
			'phone': user.phone,
			'email': user.email
		}

		this.setState(userData);

		var updateState = {}

		switch(user.status) {
		case 'signup-failed-existing-account':
			updateState.email_existing_error = true;

		case 'signup-failed':
			updateState.error = true;

			// Clear password inputbox
			this.refs.password.value = ''; 
			this.refs.confirm_password.value = ''; 

			// Focus on email inputbox
			this.refs.email.select();

			this.setState(updateState);
		}
	}

	render() {
		var phoneClasses = 'required field';
		var emailClasses = 'required field';
		var nameClasses = 'required field';
		var passwordClasses = 'required field';
		var confirmClasses = 'required field';
		var message;
		var fieldClass = 'field';
		var user = this.state;

		if (this.state.error) {
			fieldClass += ' error';

			if (this.state.email_existing_error) {
				emailClasses += ' error';
				message = (
					<div className='ui negative icon message'>
						<i className={'warning sign icon'} />
						<div className='content'>
							<div className='header'>註冊失敗</div>
							<p>email已經有人用囉!，請重新輸入</p>
						</div>
					</div>
				);
			} else {
				message = (
					<div className='ui negative icon message'>
						<i className={'warning sign icon'} />
						<div className='content'>
							<div className='header'>註冊失敗</div>
							<p>請重新確認你輸入的資料</p>
						</div>
					</div>
				);

				if (this.state.email_error) {
					emailClasses += ' error';
				}
			}

			if (this.state.name_error) {
				nameClasses += ' error';
			}

			if (this.state.phone_error) {
				phoneClasses += ' error';
			}

			if (this.state.password_error) {
				passwordClasses += ' error';
			}

			if (this.state.confirm_error) {
				confirmClasses += ' error';
			}
		}

		return (
			<div className='main-page'>
				<Header />
				<div className={'ui basic center aligned segment landing-page-header'} style={bannerStyle}>
					<h2 className="head-title color-white">很想去</h2>
					<h1 className="head-sub-title color-white">東京？巴黎？紐約？莫斯科？</h1>
					<button className={'large ui inverted button join'} onClick={this.joinUs} style={joinBtnStyle}>
						加入 Limago
					</button>
				</div>

				<div className={'ui basic center aligned segment'}>
					<div className="ui stackable three column grid">
						<div className="four wide column"></div>
						<div className="seven wide column">
							<h2 className="limago-description">
								LiMaGo 提供 100 個以上的獨特早鳥票，只要輸入你專屬的臨時會員編號，登入 LiMaGo 會員，你就有機會立馬進行一趟美妙的隨機旅程。
							</h2>
						</div>
					</div>
				</div>

				<div className={'ui basic center aligned segment target-space'}>
					<img className="arrow" src={ arrow } />
				</div>

				<div ref="joinUs" className={'ui basic center aligned segment user-data'}>
					<img className="ui middle aligned tiny image title-tag" src={ pen } />
					<span className="main-title">馬上開始你的旅程</span>
					<div className='ui hidden divider'></div>
					<div className='ui hidden divider'></div>

					<div className='ui two column centered stackable grid'>
						<div className='seven wide column'>
							<div className={'ui basic segment'}>
								{message}
								<div className='ui form'>
									<div className={nameClasses}>
										<label style={lableStyle}>你的姓名</label>
										<div className={'ui left icon input'}>
											<i className={'user icon'} />
											<input type='text' ref='name' name='name' placeholder='Limago' value={ user.name || null } onChange={this.saveEditTime} />
										</div>
									</div>

									<div className={phoneClasses}>
										<label style={lableStyle}><I18n sign='sign_up.phone'>Cellphone Number</I18n></label>
										<div className={'ui left icon input'}>
											<i className={'phone icon'} />
											<input type='text' ref='phone' name='phone' placeholder='0912345678' value={ user.phone || null } onChange={this.saveEditTime} />
										</div>
									</div>

									<div className={emailClasses}>
										<label style={lableStyle}><I18n sign='sign_up.email'>E-mail Address</I18n></label>
										<div className={'ui left icon input'}>
											<i className={'mail icon'} />
											<input type='email' ref='email' name='email' placeholder='limago@example.com' value={ user.email || null } onChange={this.saveEditTime} />
										</div>
									</div>

									<div className={passwordClasses}>
										<label style={lableStyle}><I18n sign='sign_up.password'>Password</I18n></label>
										<div className={'ui left icon input'}>
											<i className={'lock icon'} />
											<input type='password' ref='password' name='password' onChange={this.saveEditTime} />
										</div>
									</div>

									<div className={confirmClasses}>
										<label style={lableStyle}><I18n sign='sign_up.confirm'>Confirm</I18n></label>
										<div className={'ui left icon input'}>
											<i className={'lock icon'} />
											<input type='password' ref='confirm_password' name='confirm_password' onChange={this.saveEditTime} />
										</div>
									</div>

									<div className='field'>
										<button className="big ui inverted button center-block" style={joinBtnStyle} onClick={this.signUp}>
											<i className="icon send"></i>
											送出資料
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div ref="app_section"></div>
				<Footer />
			</div>
		);
	}
}

export default StudentWithTicketPage;

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
import sakulaWhite from 'Source/images/sakula-white.png';
import email from 'Source/images/email-black.png';
import sakulaBanner from 'Source/images/sakula.png';
import plane from 'Source/images/plane.jpg';
import jpIcon1 from 'Source/images/jp-icon-1.png';
import jpIcon2 from 'Source/images/jp-icon-2.png';
import jpIcon3 from 'Source/images/jp-icon-3.png';
import jpIcon4 from 'Source/images/jp-icon-4.png';

var sectionStyle = {
	paddingTop: '40px',
	paddingBottom: '50px'
};

var joinBtnStyle = {
	marginTop: '20px',
};

var submitBtnStyle = {
	marginTop: '50px',
};

var stepStyle = {
	marginTop: '30px',
	paddingLeft: '5%'
};

var lableStyle = {
	color: 'white',
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
		var planeStyle = {
			marginLeft: 'auto',
			marginRight: 'auto'
		};
		var jpIconStyle = {
			width: '110px',
			marginLeft: 'auto',
			marginRight: 'auto',
			marginTop: '40px'
		};
		var limaogStyle = {
			display: 'inline-block',
			paddingLeft: '10px',
			paddingRight: '10px',
			color: '#cc3300',
			marginTop: 0,
			marginBottom: 0,
			paddingBottom: '8px',
			borderBottom: '2px solid #cc3300'
		};
		var travelStyle = {
			marginTop: '8px'
		};
		var japanLang = {
			color: '#ebebe0',
			lineHeight: '25px',
			marginTop: '5px'
		};
		var dottedStyle = {
			color: '#cc3300',
			fontSize: '10px',
			verticalAlign: 'top',
			marginTop: '2px'
		};
		var redLineStyle = {
			backgroundColor: '#cc3300',
			minHeight: '100px'
		};
		var sakulaStyle = {
			padding: 0
		};
		var desStyle = {
			lineHeight: '50px'
		};

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
				<div className={'ui basic center aligned segment landing-page-student'}>
					<div className="ui one column centered grid">
						<div className="computer only tablet only three wide column">
							<div className="ui very padded center aligned segment mark">
								<h1 className="head-sub-title">京都</h1>
								<h2 style={japanLang}>きょうと</h2>
							</div>
						</div>
						<div className="mobile only ten wide column">
							<div className="ui very padded center aligned segment mark">
								<h1 className="head-sub-title">京都</h1>
								<h2 style={japanLang}>きょうと</h2>
							</div>
						</div>
					</div>

					<div className="ui one column centered grid">
						<div className="computer only tablet only three wide column">
							<button className={'huge ui inverted button join'} onClick={this.joinUs} style={joinBtnStyle}>
								加入 Limago
							</button>
						</div>
						<div className="mobile only ten wide column">
							<button className={'huge ui inverted button join'} onClick={this.joinUs} style={joinBtnStyle}>
								加入 Limago
							</button>
						</div>
					</div>
				</div>
				<div className='ui hidden divider'></div>

				<div className="ui computer only tablet only stackable five column centered grid">
					<div className="column">
						<img className="ui tiny image" src={jpIcon1} style={jpIconStyle} />
					</div>
					<div className="column">
						<img className="ui tiny image" src={jpIcon2} style={jpIconStyle} />
					</div>
					<div className="column">
						<div className="ui basic center aligned segment">
							<img className="ui tiny image" src={plane} style={planeStyle} />
							<h2 style={limaogStyle}>Limago</h2>
							<h3 style={travelStyle}>隨機旅遊</h3>
						</div>
					</div>
					<div className="column">
						<img className="ui tiny image" src={jpIcon3} style={jpIconStyle} />
					</div>
					<div className="column">
						<img className="ui tiny image" src={jpIcon4} style={jpIconStyle} />
					</div>
				</div>

				<div className="ui mobile only one column centered grid">
					<div className="column">
						<div className="ui basic center aligned segment">
							<img className="ui tiny image" src={plane} style={planeStyle} />
							<h2 style={limaogStyle}>Limago</h2>
							<h3 style={travelStyle}>隨機旅遊</h3>
						</div>
					</div>
				</div>

				<div className='ui hidden divider'></div>
				<div className='ui hidden divider'></div>

				<div className="ui computer only tablet only stackable grid center aligned container">
					<div className="three column row">
						<div className="column"><h1><i className="circle icon" style={dottedStyle}></i> 隨機出發</h1></div>
						<div className="column"><h1><i className="circle icon" style={dottedStyle}></i> 隨機地點</h1></div>
						<div className="column"><h1><i className="circle icon" style={dottedStyle}></i> 隨機同行</h1></div>
					</div>
				</div>

				<div className='ui hidden divider'></div>
				<div className='ui hidden divider'></div>
				<div className='ui hidden divider'></div>
				<div className={'ui basic segment des-background'}>
					<div className="ui grid">
						<div className="six wide column"></div>
						<div className="ten wide column" style={redLineStyle}>
							<div className="ui stackable grid">
								<div className="nine wide column" style={sakulaStyle}>
									<img className="ui fluid image" src={sakulaWhite} />
								</div>
							</div>
						</div>
					</div>
					<div className="ui stackable two column grid">
						<div className="six wide column" style={sakulaStyle}>
							<img className="ui fluid image" src={sakulaBanner} />
						</div>
						<div className="ten wide column sakula">
							<div className="ui grid">
								<div className="two wide column"></div>
								<div className="computer only tablet only eleven wide column">
									<div className='ui hidden divider'></div>
									<div className='ui hidden divider'></div>
									<div className={'ui very padded basic segment'}>
										<h1 style={desStyle}>
											想要來場隨機旅遊嗎？LiMaGo 提供 100 張以上的獨特早鳥票，滿足每一位渴望驚奇的你，只要提上行李就能隨時出發！還在考慮什麼？馬上填寫下方的登入資料！立即享有一趟美妙的隨機旅程吧。
										</h1>
									</div>
									<div className='ui hidden divider'></div>
									<div className='ui hidden divider'></div>
								</div>
								<div className="mobile only sixteen wide column">
									<div className={'ui basic segment'}>
										<h1 style={desStyle}>
											想要來場隨機旅遊嗎？LiMaGo 提供 100 張以上的獨特早鳥票，滿足每一位渴望驚奇的你，只要提上行李就能隨時出發！還在考慮什麼？馬上填寫下方的登入資料！立即享有一趟美妙的隨機旅程吧。
										</h1>
									</div>
									<div className='ui hidden divider'></div>
									<div className='ui hidden divider'></div>
								</div>
							</div>
						</div>
					</div>
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
											<input type='text' ref='name' name='name' placeholder='Limago' defaultValue={ user.name || null } onChange={this.saveEditTime} />
										</div>
									</div>

									<div className={phoneClasses}>
										<label style={lableStyle}><I18n sign='sign_up.phone'>Cellphone Number</I18n></label>
										<div className={'ui left icon input'}>
											<i className={'phone icon'} />
											<input type='text' ref='phone' name='phone' placeholder='0912345678' defaultValue={ user.phone || null } onChange={this.saveEditTime} />
										</div>
									</div>

									<div className={emailClasses}>
										<label style={lableStyle}><I18n sign='sign_up.email'>E-mail Address</I18n></label>
										<div className={'ui left icon input'}>
											<i className={'mail icon'} />
											<input type='email' ref='email' name='email' placeholder='limago@example.com' defaultValue={ user.email || null } onChange={this.saveEditTime} />
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
										<button className="big ui inverted button center-block" style={submitBtnStyle} onClick={this.signUp}>
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

				<div className={'ui basic center aligned segment footer'}>
					<img className="ui middle aligned tiny image icon" src={ email } />
					<span>contact@limago.com</span>
					<br />
					<span>Copyright &copy; 2015 Limago Project. All Rights Reserved.</span>
				</div>
			</div>
		);
	}
}

export default StudentWithTicketPage;
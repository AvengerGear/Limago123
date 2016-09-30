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
import greenlight from 'Source/images/retired-greenlight.jpg';
import england from 'Source/images/worker-england.jpg';
import japan from 'Source/images/retired-japan.jpg';
import longwall from 'Source/images/retired-longwall.jpg';
import paris from 'Source/images/retired-paris.jpg';
import redwine from 'Source/images/retired-redwine.jpg';
import ship from 'Source/images/retired-ship.jpg';
import starsky from 'Source/images/retired-starsky.jpg';
import sakula from 'Source/images/retired-sakula.jpg';

// icons
import arrow from 'Source/images/arrow.png';
import pen from 'Source/images/pen.png';
import sakulaWhite from 'Source/images/sakula-white.png';
import email from 'Source/images/email-black.png';
import lantern from 'Source/images/lantern.png';

var sectionStyle = {
	paddingTop: '40px',
	paddingBottom: '50px'
};

var joinBtnStyle = {
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
class RetiredWithTicketPage extends React.Component {
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
		var limaogStyle = {
			color: '#cc3300',
			marginBottom: 0,
			paddingBottom: '8px',
			borderBottom: '2px solid #cc3300'
		};
		var travelStyle = {
			marginTop: '8px'
		};
		var sloganStyle = {
			fontSize: '32px'
		};
		var sloganScreenStyle = {
			fontSize: '44px'
		};
		var dottedStyle = {
			color: '#cc3300',
			fontSize: '10px',
			verticalAlign: 'top'
		};
		var redLineStyle = {
			backgroundColor: '#cc3300',
			minHeight: '100px'
		};
		var ticketStyle = {
			textAlign: 'left'
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
				<section>
					<div className={'ui basic center aligned segment landing-page-retired'}>
						<div className="ui one column centered grid">
							<div className="computer only three wide column">
								<div className="ui very padded center aligned segment">
									<h1 className="head-sub-title">隨機<br />旅遊</h1>
									<div className="ui basic center aligned segment">
										<h2 style={limaogStyle}>Limago</h2>
										<h3 style={travelStyle}>立馬出發</h3>
									</div>
								</div>
							</div>

							<div className="tablet only seven wide column">
								<div className="ui very padded center aligned segment">
									<h1 className="head-sub-title">隨機<br />旅遊</h1>
									<div className="ui basic center aligned segment">
										<h2 style={limaogStyle}>Limago</h2>
										<h3 style={travelStyle}>立馬出發</h3>
									</div>
								</div>
							</div>

							<div className="mobile only ten wide column">
								<div className="ui very padded center aligned segment">
									<h1 className="head-sub-title">隨機<br />旅遊</h1>
									<div className="ui basic center aligned segment">
										<h3 style={limaogStyle}>Limago</h3>
										<h5 style={travelStyle}>立馬出發</h5>
									</div>
								</div>
							</div>
						</div>

						<div className="ui one column centered grid">
							<div className="ten wide column">
								<button className={'large ui inverted button join'} onClick={this.joinUs} style={joinBtnStyle}>
									加入 Limago
								</button>
							</div>
						</div>
					</div>
				</section>

				<div className='ui hidden divider'></div>
				<div className='ui hidden divider'></div>
				<div className='ui hidden divider'></div>

				<section>
					<div className="ui stackable grid center aligned container">
						<div className="computer only tablet only one column row">
							<h1 style={sloganScreenStyle}>重新發現旅遊的重要</h1>
						</div>
						<div className="mobile only one column row">
							<h1 style={sloganStyle}>重新發現旅遊的重要</h1>
						</div>
					</div>

					<div className="ui centered grid">
						<div className="computer only four wide column">
							<div className="ui three column grid">
								<div className="three column centered row">
									<div className="column"><h3><i className="circle icon" style={dottedStyle}></i> 隨機出發</h3></div>
									<div className="column"><h3><i className="circle icon" style={dottedStyle}></i> 隨機地點</h3></div>
									<div className="column"><h3><i className="circle icon" style={dottedStyle}></i> 隨機同行</h3></div>
								</div>
							</div>
						</div>
						<div className="tablet only ten wide column">
							<div className="ui three column grid">
								<div className="three column centered row">
									<div className="column"><h3><i className="circle icon" style={dottedStyle}></i> 隨機出發</h3></div>
									<div className="column"><h3><i className="circle icon" style={dottedStyle}></i> 隨機地點</h3></div>
									<div className="column"><h3><i className="circle icon" style={dottedStyle}></i> 隨機同行</h3></div>
								</div>
							</div>
						</div>
						<div className="mobile only fifteen wide column">
							<div className="ui three column grid">
								<div className="three column centered row">
									<div className="column"><h4><i className="circle icon" style={dottedStyle}></i> 隨機出發</h4></div>
									<div className="column"><h4><i className="circle icon" style={dottedStyle}></i> 隨機地點</h4></div>
									<div className="column"><h4><i className="circle icon" style={dottedStyle}></i> 隨機同行</h4></div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<div className='ui hidden divider'></div>
				<div className='ui hidden divider'></div>
				<div className='ui hidden divider'></div>

				<section className="ui basic segment container">
					<div className="ui stackable centered grid">
						<div className="two column row">
							<div className="ten wide column">
								<img className="ui fluid image" src={longwall} alt="" />
							</div>
							<div className="five wide column">
								<img className="ui fluid image" src={paris} alt="" />
							</div>
						</div>
						<div className="three column row">
							<div className="five wide column">
								<img className="ui fluid image" src={england} alt="" />
							</div>
							<div className="five wide column">
								<img className="ui fluid image" src={greenlight} alt="" />
							</div>
							<div className="five wide column">
								<img className="ui fluid image" src={ship} alt="" />
							</div>
						</div>
						<div className="two column row">
							<div className="five wide column">
								<img className="ui fluid image" src={redwine} alt="" />
							</div>
							<div className="computer only ten wide column">
								<div className="ui very padded basic segment">
									<h1 style={ticketStyle}>LiMaGo 提供 100 個以上的獨特早鳥票，只要登入我們的會員，你就有機會馬上進行一趟美妙的旅程。</h1>
								</div>
							</div>
							<div className="tablet only ten wide column">
								<div className="ui padded basic segment">
									<h3 style={ticketStyle}>LiMaGo 提供 100 個以上的獨特早鳥票，只要登入我們的會員，你就有機會馬上進行一趟美妙的旅程。</h3>
								</div>
							</div>
							<div className="mobile only ten wide column">
								<div className="ui padded basic segment">
									<h3>LiMaGo 提供 100 個以上的獨特早鳥票，只要登入我們的會員，你就有機會馬上進行一趟美妙的旅程。</h3>
								</div>
							</div>
						</div>
						<div className="three column row">
							<div className="five wide column">
								<img className="ui fluid image" src={sakula} alt="" />
							</div>
							<div className="five wide column">
								<img className="ui fluid image" src={japan} alt="" />
							</div>
							<div className="five wide column">
								<img className="ui fluid image" src={starsky} alt="" />
							</div>
						</div>
					</div>
				</section>

				<section>
					<div className={'ui basic center aligned segment landing-page-package'}>
						<div className="ui one column centered grid">
							<div className="ten wide column">
								<h1>準備好行李了嗎？</h1>
							</div>
						</div>
					</div>
				</section>

				<section ref="joinUs" className={'ui basic center aligned segment user-data'}>
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
										<button className="big ui inverted button center-block" style={joinBtnStyle} onClick={this.signUp}>
											<i className="icon send"></i>
											送出資料
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

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

export default RetiredWithTicketPage;

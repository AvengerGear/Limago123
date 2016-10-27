import React from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import I18n from 'Extension/I18n.jsx';

// Decorators
import { flux, router, preAction, wait } from 'Decorator';

// icons
import xIcon from 'Source/images/x-icon-white.png';
import xIconBrown from 'Source/images/x-icon-brown.png';
import xIconOrange from 'Source/images/x-icon-orange.png';
import xIconGreen from 'Source/images/x-icon-green.png';

import peopleIcon from 'Source/images/people-icon-2.png';
import ticketIcon from 'Source/images/ticket-icon-5.png';
import timeIcon from 'Source/images/time-icon-8.png';

import arrow from 'Source/images/arrow.png';
import pen from 'Source/images/pen.png';

var sectionStyle = {
	paddingTop: '40px',
	paddingBottom: '50px'
};
var peopleColor =  {
	backgroundColor: '#BCA27D'
};
var breakInput = {
	marginTop: '100px'
};
var breakItems = {
	marginTop: '150px'
};

class Notes extends React.Component {
	render() {
		return (
			<div className="ui stackable two column grid">
				<div className="three wide column"></div>
				<div className="ten wide column">
					<p className="text-left textarea-tag color-white">最想去哪裡旅行 ?</p>
					<div className="ui fluid icon input">
						<textarea rows="6" cols="250"></textarea>
					</div>
				</div>
			</div>
		);
	}
}

@router
@flux
@preAction((handle) => {
	handle.doAction('User.demoThree.getTypeCount', handle.props.params.type);
})
@wait('User')
class LandingPage extends React.Component {
	constructor(props, context) {
		super(props, context);

		var state = context.flux.getState('User');

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
			people: '',
			price: '',
			times: '',
			step1_status: 'active',
			timer_start: null,
			timer_edit: null,
			isEdit: false,
			timer_send: null,
			qrcode: '1ef902f0099a68c7',
			type: props.params.type,
			typeCounter: state.typeCounter,
			people: '1',
			time: '3'
		};
	}

	componentWillMount = () => {
		this.flux.on('state.User', this.flux.bindListener(this.onChange));
	};

	componentWillUnmount = () => {
		this.flux.off('state.User', this.onChange);
	};

	componentDidMount = () => {
	// 	var url = window.location.pathname;
	// 	var urlArrs = url.split('/');
		var tickets = this.flux.getState('Tickets').data;
		var isQrcode = false;
		var currentTime = new Date();

		var people = Math.floor(Math.random() * 3) + 1;
		if (people == 1) {
			people = '1';
		}else if (people == 2) {
			people = '2';
		}else if (people == 3) {
			people = 'n';
		}

		var time = Math.floor(Math.random() * 3) + 1;
		if (time == 1) {
			time = '3';
		}else if (time == 2) {
			time = '8';
		}else if (time == 3) {
			time = '24';
		}

		var state = {
			qrcode: people + ',' + time,
			timer_start: currentTime,
			people: people,
			time: time
		};

		tickets.forEach(ticket => {
			if (this.state.qrcode == ticket.qrcode) {
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
			'email': user.email,
			'typeCounter': user.typeCounter
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
		var includeIconBrown = <img className="ui mini image include" src={ xIconBrown } />;
		var includeIconOrange = <img className="ui mini image include" src={ xIconOrange } />;
		var includeIconGreen = <img className="ui mini image include" src={ xIconGreen } />;
		var includeIcon = <img className="ui mini image include" src={ xIcon } />;

		var ticketStyle = {
			textAlign: 'left'
		};
		var lableStyle = {
			color: 'white',
			textAlign: 'left'
		};
		var joinBtnStyle = {
			marginTop: '50px',
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

		var people = this.state.people;
		if (this.state.people == 'n') {
			people = '多';
		}

		return (
			<div className='main-page'>
				<Header ref='header' />

				<div className={'ui basic center aligned segment landing-page-demo-four-header'}>
					<h2 className="head-title">很想去</h2>
					<br />
					<h1 className="head-sub-title">東京？巴黎？紐約？莫斯科？</h1>
					<div style={ breakInput }></div>

					<button className={'huge ui orange button join'} onClick={this.joinUs}>
						加入 Limago
					</button>

					<div style={ breakItems }></div>
					<div className="ui stackable three column grid">
						<div className="column item">
							<img className="ui middle aligned tiny image" src={peopleIcon} />
							<span className="color-white item-title">人數</span>
						</div>
						<div className="column item center-item">
							<img className="ui middle aligned tiny image" src={ticketIcon} />
							<span className="color-white item-title"> 機票</span>
						</div>
						<div className="column item">
							<img className="ui middle aligned tiny image" src={timeIcon} />
							<span className="color-white item-title"> 時間</span>
						</div>
					</div>
				</div>

				<section style={ sectionStyle } className="limago">
					<div className={'ui basic center aligned segment'}>
							<h1>
								Limago
								<span className="step-number color-white bg-color-brown">1</span>
								<span className="step-number color-white bg-color-orange">2</span>
								<span className="step-number color-white bg-color-green">3</span>
							</h1>
					</div>
				</section>

				<section className="section-selects">
					<div className="ui stackable two column grid limago-select">
						<div className="five wide column people-section-icon">
							<div className={'ui basic center aligned segment'}>
								<img className="ui middle aligned tiny image section-text" src={ peopleIcon } /	>
								<p className="color-white icon-tag">人數</p>
							</div>
						</div>
						<div className="eleven wide column">
							<div className="ui stackable sixteen column grid people-section">
								<div className="three wide column"></div>
								<div className="ten wide column section-text">
									<h1 className="select-title color-brown text-right">
										多 <span className="color-black">人同行</span>
									</h1>
									<p className="text-right select-sub-title">你將有機會認識不一樣的朋友</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="section-selects">
					<div className="ui stackable two column grid limago-select flex">
					<div className="mobile only five wide column ticket-section-icon">
						<div className={'ui basic center aligned segment'}>
							<img className="ui middle aligned tiny image section-text" src={ ticketIcon } /	>
							<p className="color-white icon-tag">機票</p>
						</div>
					</div>
						<div className="eleven wide column">
							<div className="ui stackable sixteen column grid ticket-section">
								<div className="three wide column"></div>
								<div className="ten wide column section-text">
									<h1 className="select-title color-orange text-right">
										5 <span className="color-black">折機票</span>
									</h1>
									<p className="text-right select-sub-title">同時享有你意想不到的折扣機票</p>
								</div>
							</div>
						</div>
						<div className="computer only tablet only five wide column ticket-section-icon">
							<div className={'ui basic center aligned segment'}>
								<img className="ui middle aligned tiny image section-text" src={ ticketIcon } /	>
								<p className="color-white icon-tag">機票</p>
							</div>
						</div>
					</div>
				</section>

				<section className="section-selects">
					<div className="ui stackable two column grid limago-select">
						<div className="five wide column time-section-icon">
							<div className={'ui basic center aligned segment'}>
								<img className="ui middle aligned tiny image section-text" src={ timeIcon } /	>
								<p className="color-white icon-tag">時間</p>
							</div>
						</div>
						<div className="eleven wide column time-section">
							<div className="ui stackable sixteen column grid">
								<div className="thirteen wide column section-text">
									<h1 className="select-title color-green text-right">
										24 <span className="color-black">小時內出發</span>
									</h1>
									<p className="text-right select-sub-title">心動了嗎？那就馬上收拾你的行李吧！</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				<div className={'ui basic center aligned segment'}>
					<div className="ui stackable three column grid">
						<div className="four wide column"></div>
						<div className="seven wide column">
							<h2 className="limago-description">
								LiMaGo 提供 100 個以上的獨特早鳥票，只要登入我們的會員，你就有機會馬上進行一趟美妙的旅程。
							</h2>
						</div>
					</div>
				</div>

				<div className={'ui basic center aligned segment target-space'}>
					<img className="arrow" src={ arrow } />
				</div>

				<section ref="joinUs" className={'ui basic center aligned segment user-data'}>
					<img className="ui middle aligned tiny image title-tag" src={ pen } />
					<span className="main-title">馬上開始你的旅程</span>
					<div className='ui hidden divider'></div>
					<div className='ui hidden divider'></div>

					<div className='ui two column centered stackable grid'>
						<div className='seven wide column'>
							<div className={'ui basic segment'}>
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

									<h4 style={ticketStyle}>附註說明:</h4>
									<p style={ticketStyle}>1. 當您完成電子郵件登記，將會不定期的收到隨機旅遊所發出的活動邀請函。</p>
									<p style={ticketStyle}>2. 每個活動邀請函將包含一個隨機旅遊地點，您可報名參加或選擇忽略並等待下一次的邀請函。</p>
									<p style={ticketStyle}>3. 若您選擇報名參加，將有 24 小時時間準備，然後即刻搭機出發！</p>
									<p style={ticketStyle}>4. 我們將提供旅遊全程網際網路連線，以確保您可以隨時利用網路進行旅遊資訊查詢或求助。</p>
									<p style={ticketStyle}>5. 在旅遊目的地點，您將由自己處理交通與食宿。但若遭遇困境或危險，我們會有全天無休的專員，提供您全方位的旅遊協助與緊急救援服務。</p>

									<div className='ui hidden divider'></div>
									<div className='ui hidden divider'></div>

									<div className="ui centered grid">
										<div className="row">
											<div className="column">
												{message}
												<div className={'btn-style btn-base btn-submit'} onClick={ this.signUp }>
													馬上加入Limago
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<div ref="app_section"></div>

				<Footer />
			</div>
		);
	}
}

export default LandingPage;

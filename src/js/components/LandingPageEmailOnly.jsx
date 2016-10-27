import React from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Banner from './Banner.jsx';
import I18n from 'Extension/I18n.jsx';

// Decorators
import { router, flux, i18n } from 'Decorator';

// icons
import email from 'Source/images/email.png';

var breakInput = {
	marginTop: '80px'
};

var breakItems = {
	marginTop: '50px'
};

var sectionStyle = {
	margin: 0,
	paddingTop: '150px'
};


@router
@flux
class LandingPage extends React.Component {

	constructor(props, context) {
		super(props, context);

		this.state = {
			error: false,
			email_success: false,
			email_existing_error: false,
			email_empty_error: false
		};
	}

	componentWillMount = () => {
		this.flux.on('state.User', this.flux.bindListener(this.onChange));
	}

	componentWillUnmount = () => {
		this.flux.off('state.User', this.onChange);
	}

	componentDidMount = () => {
		this.flux.dispatch('action.User.saveVisitPage',
			'langingpage', 'd7b591c3b4211daa'
		);
	}

	onChange = () => {
		var user = this.flux.getState('User');

		// No need to sign in if logined already
		if (user.logined) {
			if (this.props.location.query.target)
				this.history.pushState(null, this.props.location.query.target);
			else
				this.history.pushState(null, '/');
			return;
		}

		var userData = {
			'email': user.email
		}

		this.setState(userData);

		var updateState = {
			error: false,
			email_success: false,
			email_existing_error: false,
			email_empty_error: false
		}

		switch(user.status) {
		case 'signup-failed-existing-account':
			updateState.email_existing_error = true;

		case 'signup-failed':
			updateState.error = true;

			// Focus on email inputbox
			this.refs.email.select();

			this.setState(updateState);
			break;
		case 'normal':
			updateState.email_success = true;

			this.setState(updateState);
			break;
		}
	}

	signUp = () => {
		var email = this.refs.email.value.trim();
		var status = this.flux.getState('User').status;

		var state = {
			error: false,
			email_success: false,
			email_existing_error: false,
			email_empty_error: false
		};

		if (email == '') {
			state.error = true;
			state.email_empty_error = true;
		}

		if (status == 'signup-failed-existing-account') {
			state.error = true;
			state.email_existing_error = true;
		}

		// Something's wrong
		if (state.error) {
			this.setState(state);
			return;
		}

		// Sign up now
		this.flux.dispatch('action.User.signUpEmailOnly',
			this.refs.email.value
		);
	}

	closeAlert = () => {
		if (this.flux.getState('User').status == 'reset') {
			return;
		}

		this.setState({
			error: false,
			email_success: false,
			email_existing_error: false,
			email_empty_error: false
		});

		this.flux.dispatch('action.User.resetStatus',
			this.refs.email.value
		);
	}

	render() {
		var message;

		if (this.state.email_empty_error) {
			message = (
				<div className="ui negative message">
					<i className="close icon" onClick={this.closeAlert}></i>
					<div className="header">Oops !!</div>
					<p>你忘了填信箱囉!</p>
				</div>
			);
		}
		if (this.state.email_existing_error) {
			message = (
				<div className="ui negative message">
					<i className="close icon" onClick={this.closeAlert}></i>
					<div className="header">Oops !!</div>
					<p>這個信箱已經有人用囉! 請重新輸入一組新的E-mail。</p>
				</div>
			);
		}
		if (this.state.email_success) {
			message = (
				<div className="ui success message">
					<i className="close icon" onClick={this.closeAlert}></i>
					<div className="header">我們已經收到你的聯絡資訊囉 !!</div>
					<p>歡迎你加入 Limago 隨機旅遊的行列</p>
				</div>
			);
		}

		return (
			<div className='main-page'>
				<Header ref='header' />
				<div className={'ui basic center aligned segment landing-page-header'} style={sectionStyle}>
					<h2 className="head-title">很想去</h2>
					<br />
					<div className="ui one column centered grid">
						<div className="computer only ten wide column">
							<h1 className="head-sub-title">東京？巴黎？紐約？莫斯科？</h1>
						</div>
						<div className="tablet only eleven wide column">
							<h1 className="head-sub-title">東京？巴黎？紐約？莫斯科？</h1>
						</div>
						<div className="mobile only fifteen wide column">
							<h1 className="head-mobile-sub-title">東京？巴黎？紐約？莫斯科？</h1>
						</div>
					</div>

					<div style={ breakInput }></div>

					<div className="ui one column centered grid">
						<div className="six wide computer eight wide tablet fourteen wide mobile column">
							<div className="ui fluid icon input">
								<input type="email" ref="email" placeholder="請輸入E-mail" onChange={this.closeAlert} />
							</div>
							{ message }
							<p className="text-left input-tag color-gray">E-mail</p>
						</div>
					</div>

					<button className={'large ui inverted button join'} onClick={this.signUp}>
						加入 Limago
					</button>

					<div className='ui hidden divider'></div>
					<div className='ui hidden divider'></div>
					<div className='ui hidden divider'></div>
					<div className='ui hidden divider'></div>
					<div className='ui hidden divider'></div>
					<div className='ui hidden divider'></div>

					<div className="ui one column centered grid">
						<div className="computer only six wide column">
							<div className="ui stacked segment">
								<h4 className="ui header">對隨機旅遊感興趣嗎？</h4>
								<p>請留下您的 E-mail，Limago 將提供最新的資訊給您。</p>
							</div>
						</div>
						<div className="tablet only eight wide column">
							<div className="ui stacked segment">
								<h4 className="ui header">對隨機旅遊感興趣嗎？</h4>
								<p>請留下您的 E-mail，Limago 將提供最新的資訊給您。</p>
							</div>
						</div>
						<div className="mobile only fourteen wide column">
							<div className="ui stacked segment">
								<h4 className="ui header">對隨機旅遊感興趣嗎？</h4>
								<p>請留下您的 E-mail，Limago 將提供最新的資訊給您。</p>
							</div>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		);
	}
}

export default LandingPage;

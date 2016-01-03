import React from 'react';
import I18n from 'Extension/I18n.jsx';

// Decorators
import { router, flux, i18n } from 'Decorator';

// Components
import Header from './Header.jsx';

import ticket from 'Source/images/ticket.jpg';

@router
@flux
class SignUpPage extends React.Component {
	constructor() {
		super();

		this.state = {
			error: false,
			number_error: false,
			number_empty_error: false
		};
	}

	componentWillMount = () => {
		this.flux.on('state.User', this.flux.bindListener(this.onChange));
	}

	componentWillUnmount = () => {
		this.flux.off('state.User', this.onChange);
	}

	getNumber = () => {
		var number = this.refs.number.value.trim();

		var state = {
			error: false,
			number_error: false,
			number_empty_error: false
		};

		if (number == '') {
			state.error = true;
			state.number_error = true;
			state.number_empty_error = true;
		}

		// Something's wrong
		if (state.error) {
			this.setState(state);
			return;
		}

		// Get number
		this.flux.dispatch('action.User.getNumber',
			this.refs.number.value
		);
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
		var numberClasses = 'required field';
		var message;
		var fieldClass = 'field';

		if (this.state.error) {
			fieldClass += ' error';

			if (this.state.number_error) {
				numberClasses += ' error';
			}

			if (this.state.confirm_error) {
				confirmClasses += ' error';
			}
		}

		return (
			<div className='main-page'>
				<Header />
				<div className={'ui basic center aligned padded segment'}>
					<div className='ui hidden divider'></div>
					<div className='ui hidden divider'></div>

					<div className='ui two column centered stackable grid'>
						<div className='column'>
							<h1 className='ui header'>
								<i className='suitcase icon' />
								<div className='content'><I18n sign='sign_up.header'>請輸入臨時會員編號</I18n></div>
							</h1>
						
							<div className="ui ordered steps">
								<div className="completed step">
									<div className="content">
										<div className="title">取得帳號</div>
										<div className="description">請直接註冊</div>
									</div>
								</div>
								<div className="active step">
									<div className="content">
										<div className="title">輸入臨時會員編號</div>
										<div className="description">一個編號只能使用一次</div>
									</div>
								</div>
								<div className="active step">
									<div className="content">
										<div className="title">完成註冊</div>
										<div className="description">恭喜你取得專屬票券！</div>
									</div>
								</div>
							</div>

							<div className={'ui basic segment'}>
								{message}

								<div className='ui form'>

									<div className={numberClasses}>
										<label><I18n sign='sign_up.display_name'>臨時會員編號</I18n></label>
										<div className={'ui left icon input'}>
											<i className={'user icon'} />
											<input type='text' ref='number' name='number' placeholder='1234567890' />
										</div>
									</div>

									<div className='field'>
										<button className='ui teal button' onClick={this.getNumber}>
											<I18n sign='sign_up.submit_button'>Register</I18n>
										</button>
										<br /><br />
										<a className="ui red tag label pull-right">示意圖</a>
										<img className="ui fluid image" src={ ticket } />
									</div>
								</div>
							</div>
						</div>

					</div>

				</div>
			</div>
		);
	}
}

export default SignUpPage;

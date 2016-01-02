import React from 'react';
import I18n from 'Extension/I18n.jsx';

// Decorators
import { router, flux, i18n } from 'Decorator';

// Components
import Header from './Header.jsx';

@router
@flux
class SignUpPage extends React.Component {
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
			phone_empty_error: false
		};
	}

	componentWillMount = () => {
		this.flux.on('state.User', this.flux.bindListener(this.onChange));
	}

	componentWillUnmount = () => {
		this.flux.off('state.User', this.onChange);
	}

	signUp = () => {
		var urls = window.location.pathname;
		var urlArrs = urls.split('/');
		
		var email = this.refs.email.value.trim();
		var phone = this.refs.phone.value.trim();
		var name = this.refs.name.value.trim();
		var password = this.refs.password.value;
		var confirm_password = this.refs.confirm_password.value;

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

		// Something's wrong
		if (state.error) {
			this.setState(state);
			return;
		}

		// Sign up now
		this.flux.dispatch('action.User.signUp',
			this.refs.email.value,
			this.refs.phone.value,
			this.refs.password.value,
			this.refs.name.value
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
							<div className='header'>Failed to Sign Up</div>
							<p>Account exists already. Please type another e-mail address then try again</p>
						</div>
					</div>
				);
			} else {
				message = (
					<div className='ui negative icon message'>
						<i className={'warning sign icon'} />
						<div className='content'>
							<div className='header'>Failed to Sign Up</div>
							<p>Please check all fields then try again</p>
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
				<div className={'ui basic center aligned padded segment'}>
					<div className='ui hidden divider'></div>
					<div className='ui hidden divider'></div>

					<div className='ui two column centered stackable grid'>
						<div className='column'>
							<h1 className='ui header'>
								<i className='add user icon' />
								<div className='content'><I18n sign='sign_up.header'>Create a New Account</I18n></div>
							</h1>
						
							<div className="ui ordered steps">
								<div className="active step">
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
							<p><i className="info circle icon"></i>如離開本頁請重新掃描票券上的 QR Code，重新進入本頁進行註冊。</p>

							<div className={'ui basic segment'}>
								{message}

								<div className='ui form'>

									<div className={nameClasses}>
										<label><I18n sign='sign_up.display_name'>Display Name</I18n></label>
										<div className={'ui left icon input'}>
											<i className={'user icon'} />
											<input type='text' ref='name' name='name' placeholder='Limago' value={ user.name || null } />
										</div>
									</div>

									<div className={phoneClasses}>
										<label><I18n sign='sign_up.phone'>Cellphone Number</I18n></label>
										<div className={'ui left icon input'}>
											<i className={'phone icon'} />
											<input type='text' ref='phone' name='phone' placeholder='0912345678' value={ user.phone || null } />
										</div>
									</div>

									<div className={emailClasses}>
										<label><I18n sign='sign_up.email'>E-mail Address</I18n></label>
										<div className={'ui left icon input'}>
											<i className={'mail icon'} />
											<input type='text' ref='email' name='email' placeholder='limago@example.com' autoFocus={true}  value={ user.email || null } />
										</div>
									</div>

									<div className={passwordClasses}>
										<label><I18n sign='sign_up.password'>Password</I18n></label>
										<div className={'ui left icon input'}>
											<i className={'lock icon'} />
											<input type='password' ref='password' name='password' />
										</div>
									</div>

									<div className={confirmClasses}>
										<label><I18n sign='sign_up.confirm'>Confirm</I18n></label>
										<div className={'ui left icon input'}>
											<i className={'lock icon'} />
											<input type='password' ref='confirm_password' name='confirm_password' />
										</div>
									</div>

									<div className='field'>
										<button className='ui teal button' onClick={this.signUp}>
											<I18n sign='sign_up.submit_button'>Register</I18n>
										</button>
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
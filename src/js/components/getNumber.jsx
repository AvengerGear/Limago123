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

		// Sign up now
		// this.flux.dispatch('action.User.signUp',
		// 	this.refs.email.value,
		// 	this.refs.phone.value,
		// 	this.refs.password.value,
		// 	this.refs.name.value
		// );
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

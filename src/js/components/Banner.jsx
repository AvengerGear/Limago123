import React from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import I18n from 'Extension/I18n.jsx';

// Decorators
import { router, flux, i18n } from 'Decorator';

// icons
import xIcon from 'Source/images/x-icon-white.png';

import peopleIcon from 'Source/images/people-icon-2.png';
import ticketIcon from 'Source/images/ticket-icon-5.png';
import timeIcon from 'Source/images/time-icon-8.png';

var sectionStyle = {
};

var breakInput = {
	marginTop: '100px'
};
var breakItems = {
	marginTop: '150px'
};

@router
@flux
class Banner extends React.Component {
	toSignUp = () => {
		var user = this.flux.getState('User');

		// No need to sign in if logined already
		if (!user.logined) {
			this.history.pushState(null, '/signup');

			// Copy data to sign up page
			this.flux.dispatch('action.User.toSignUp',
				this.refs.email.value,
				this.refs.phone.value,
				this.refs.name.value
			);
			
			return;
		}else {
			return;
		}
	}

	render() {
		var includeIcon = <img className="ui mini image include" src={ xIcon } />;

		return (
			<div className={'ui basic center aligned segment landing-page-header'}>
				<h2 className="head-title">很想去</h2>
				<br />
				<h1 className="head-sub-title">東京？巴黎？紐約？莫斯科？</h1>
				<div style={ breakInput }></div>
				<div className="ui stackable three column grid">
					<div className="three wide column"></div>
					<div className="ten wide column">
						<div className="ui stackable three column grid">
							<div className="column">
								<div className="ui fluid icon input">
									<input type="text" ref='name' placeholder="請輸入你的真實姓名" />
								</div>
								<p className="text-left input-tag color-white">姓名</p>
							</div>
							<div className="column">
								<div className="ui fluid icon input">
									<input type="text" ref='email' placeholder="請輸入E-mail" />
								</div>
								<p className="text-left input-tag color-white">E-mail</p>
							</div>
							<div className="column">
								<div className="ui fluid icon input">
									<input type="text" ref='phone' placeholder="請輸入你的電話號碼" />
								</div>
								<p className="text-left input-tag color-white">電話</p>
							</div>
						</div>
					</div>
				</div>

				<button className={'large ui inverted button join'} onClick={this.toSignUp}>
					加入 Limago
				</button>

				<div style={ breakItems }></div>
				<div className="ui stackable three column grid">
					<div className="column item">
						<img className="ui middle aligned tiny image" src={peopleIcon} />
						<span className="color-white item-title">人數</span>
						<h1 className="color-white item-value">
							{'{'} 1 { includeIcon } 2 { includeIcon } 多 {'}'}
						</h1>
						<span className="color-white item-value">人同行</span>
					</div>
					<div className="column item center-item">
						<img className="ui middle aligned tiny image" src={ticketIcon} />
						<span className="color-white item-title"> 機票</span>
						<h1 className="color-white item-value">
							{ '{' } 1 { includeIcon } 5 { includeIcon } 9 {'}'}
						</h1>
						<span className="color-white item-value">折機票</span>
					</div>
					<div className="column item">
						<img className="ui middle aligned tiny image" src={timeIcon} />
						<span className="color-white item-title"> 時間</span>
						<h1 className="color-white item-value">
							{'{'} 3 { includeIcon } 8 { includeIcon } 24 {'}'}
						</h1>
						<span className="color-white item-value">小時內出發</span>
					</div>
				</div>
			</div>
		);
	}
}

export default Banner;

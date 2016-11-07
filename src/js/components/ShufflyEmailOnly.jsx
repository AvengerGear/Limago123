import React from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import I18n from 'Extension/I18n.jsx';

// Decorators
import { router, flux, i18n } from 'Decorator';

// icons
import email from 'Source/images/email.png';
import logo from 'Source/images/logo-282.png';
import random from 'Source/images/random-point-384.png';
import departure from 'Source/images/departure-384.png';
import support from 'Source/images/support-384.png';



var graySectionStyle = {
	backgroundColor: 'rgb(244,244,244)'
};

var deepGraySectionStyle = {
	backgroundColor: 'rgb(232,232,232)'
};

var topSection = {
    marginTop: '40px'
};

var fontStyle = {
    fontWeight: 'lighter'
};

var listStyle = {
    textAlign: 'left'
};

var footerStyle  = {
    color: 'rgb(102,102,102)',
    fontSize: '12px'
}

@router
@flux
class ShufflyLandingPage extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
            email: null,
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

    about = () => {
		var $node = $(this.refs.app_section);
		var $header = $(ReactDOM.findDOMNode(this.refs.header));

		$('html, body').stop().animate({
			scrollTop: $node.offset().top - $header.height()
		}, 400);
	};

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
        var email = this.refs.email.value.trim();

        this.setState({
            email: email
        });

        if (this.flux.getState('User').status == 'reset') {
			return;
		}

		this.setState({
            email: email,
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

        var eamilBtnClass;
        if (!this.state.email) {
            eamilBtnClass = 'disabled';
        }else {
            eamilBtnClass = '';
        }

		return (
			<div className='shuffly-page'>
                <div ref='header'></div>
                <div className="ui one column centered grid" style={topSection}>
                    <div className="column">
                        <img className="ui centered small image" src={logo} alt=""/>
                        <h1 style={fontStyle}>一趟顛覆傳統的旅程<br />開啓人生無限的可能</h1>
                    </div>
                </div>
                <div className='ui hidden divider'></div>
                <div className="banner"></div>
                <div className='ui hidden divider'></div>
                <div className="ui one column stackable centered grid">
                    <div className="four wide column">
                        <h3 style={fontStyle}>我們擺脫制式認知，改變與創新關於旅行的一切元素，讓旅行的一切都充滿了未知與無限可能、讓每個面對日復一日不變生活的人，都有一個改變的機會、有一個最棒的開端。</h3>
                    </div>
                </div>

                <div className="ui one column stackable centered grid">
                    <div className="four wide column">
                        <button className="ui negative basic button" onClick={this.about}>即將推出，立即訂閱通知</button>
                    </div>
                </div>
                <div className="ui one column stackable centered grid">
                    <div className="four wide column">
                        <div className='ui hidden divider'></div>
                        <div className="ui section divider"></div>
                        <div className='ui hidden divider'></div>
                        <div className='ui hidden divider'></div>
                        <img className="ui centered small image" src={random} alt=""/>
                        <h1>隨機地點</h1>
                        <h3 style={fontStyle}>當您確認可旅行的天數，Shuffly 將會替您從全球 100 個以上的旅遊地點，隨機選出最合適您的目的地。而無論是哪，全都是我們精心規劃的旅程、都絕對值得您去期待。</h3>
                    </div>
                </div>
                <div className="ui one column stackable centered grid">
                    <div className="four wide column">
                        <div className='ui hidden divider'></div>
                        <div className="ui section divider"></div>
                        <div className='ui hidden divider'></div>
                        <div className='ui hidden divider'></div>
                        <img className="ui centered small image" src={departure} alt=""/>
                        <h1>今天報名隔日出發</h1>
                        <h3 style={fontStyle}>在您確認隨機抽出的旅行目的地、同意參加旅程後，您有一天的時間準備行囊，隔日即可前往機場出發。因此就算假期開始的前一天沒有任何規劃，立刻報名也不必擔心。</h3>
                    </div>
                </div>
                <div className="ui one column stackable centered grid">
                    <div className="four wide column">
                        <div className='ui hidden divider'></div>
                        <div className="ui section divider"></div>
                        <div className='ui hidden divider'></div>
                        <div className='ui hidden divider'></div>
                        <img className="ui centered small image" src={support} alt=""/>
                        <h1>24 小時全天候支援</h1>
                        <h3 style={fontStyle}>Shuffly 專員提供全天無休的支援服務，從遊覽建議、交通導航、文化簡介，一直到安全事項與緊急救援等，讓您像個身經百戰的旅遊達人，可以盡興探索又安全無虞。</h3>
                        <div className='ui hidden divider'></div>
                        <div className='ui hidden divider'></div>
                    </div>
                </div>

                <div className="ui one column stackable centered grid" style={graySectionStyle} ref='app_section'>
                    <div className="four wide column">
                        <div className='ui hidden divider'></div>
                        <div className='ui hidden divider'></div>
                        <img className="ui centered small image" src={logo} alt=""/>
                        <h2>即將推出</h2>
                        <h3 style={fontStyle}>現在就登記 Email，以確保正式上線時第一時間獲得通知！</h3>
                        <div className='ui hidden divider'></div>
                        <form className="ui form">
                            <div className="field">
                                <input type="email" ref="email" placeholder="請輸入您的 Email" onChange={this.closeAlert} />
                            </div>
                            <div className={'large ui youtube button ' + eamilBtnClass} onClick={this.signUp}>
        						加入 Limago
        					</div>
                        </form>
                        {message}
                        <div className='ui hidden divider'></div>
                        <div className='ui hidden divider'></div>
                    </div>
                </div>

                <div className="ui one column stackable centered grid" style={deepGraySectionStyle}>
                    <div className="four wide column">
                        <div className='ui hidden divider'></div>
                        <div className='ui hidden divider'></div>
                        <ol className="ui list" style={listStyle}>
                            <li>Shuffly 隨機抽出的旅遊地點，皆為免簽證與落地簽證國家，以確保您可在 24 小時內合法入境至國家，而您必須確認您的護照俱有半年以上有效期限。</li>
                            <li>當您確認參加 Shuffly 旅程後，將會預先收到隨機選出的國家景點之消費成本估算、交通、景點、風俗習慣、法律與其他注意事項等資訊，以利於您做行程前的準備參考。</li>
                            <li>若因時間不足而無法解決外幣兌換、機場接送交通等問題，Shuffly 可額外提供相關服務，以確保您的行程無礙。</li>
                            <li>Shuffly 將提供每位旅客全程網際網路，以確保每位旅客可以便於查詢資訊並隨時與我們的旅行達人維持聯繫。</li>
                            <li>Shuffly 專人為即時線上咨詢服務，若依狀況遭遇任何緊急或意外事故，則有 Shuffly 在地特約專員提供當地服務。</li>
                        </ol>
                        <div className='ui hidden divider'></div>
                        <div className='ui hidden divider'></div>
                        <div className="ui section divider"></div>
                        <div className='ui hidden divider'></div>
                        <p style={footerStyle}>Copyright © 2016 Limago Limited. 保留一切權利。</p>
                        <div className='ui hidden divider'></div>
                    </div>
                </div>
			</div>
		);
	}
}

export default ShufflyLandingPage;

import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header.jsx';
import I18n from 'Extension/I18n.jsx';

// Decorators
import { flux } from 'Decorator';

// icons
import xIcon from 'Source/images/x-icon.png';
import peopleIcon from 'Source/images/people-icon.png';
import ticketIcon from 'Source/images/ticket-icon.png';
import timeIcon from 'Source/images/time-icon.png';

var sectionStyle = {
};

var breakInput = {
	marginTop: '100px'
};
var breakItems = {
	marginTop: '150px'
};

@flux
class LandingPage extends React.Component {

	constructor(props, context) {
		super(props, context);
	}

	about = () => {
		var $node = $(this.refs.app_section);
		var $header = $(ReactDOM.findDOMNode(this.refs.header));

		$('html, body').stop().animate({
			scrollTop: $node.offset().top - $header.height()
		}, 400);
	}

	render() {
		var includeIcon = <img className="ui mini image include" src={xIcon} />;

		return (
			<div className='main-page'>
				<Header ref='header' />

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
										<input type="text" placeholder="請輸入你的真實姓名" />
									</div>
									<p className="text-left input-tag">姓名</p>
								</div>
								<div className="column">
									<div className="ui fluid icon input">
										<input type="text" placeholder="請輸入E-mail" />
									</div>
									<p className="text-left input-tag">E-mail</p>
								</div>
								<div className="column">
									<div className="ui fluid icon input">
										<input type="text" placeholder="請輸入你的電話號碼" />
									</div>
									<p className="text-left input-tag">電話</p>
								</div>
							</div>
						</div>
					</div>
					<button className={'large ui inverted button join'} onClick={this.about}>
						加入 Limago
					</button>
					<div style={ breakItems }></div>
					<div className="ui stackable three column grid">
						<div className="column item">
							<img className="ui middle aligned tiny image" src={peopleIcon} />
							<span className="color-white item-title">人數</span>
							<h1 className="color-white item-value">
								1 { includeIcon } 2 { includeIcon } 多
							</h1>
							<span className="color-white item-value">人同行</span>
						</div>
						<div className="column item center-item">
							<img className="ui middle aligned tiny image" src={ticketIcon} />
							<span className="color-white item-title"> 機票</span>
							<h1 className="color-white item-value">
								1 { includeIcon } 5 { includeIcon } 9
							</h1>
							<span className="color-white item-value">折機票</span>
						</div>
						<div className="column item">
							<img className="ui middle aligned tiny image" src={timeIcon} />
							<span className="color-white item-title"> 時間</span>
							<h1 className="color-white item-value">
								3 { includeIcon } 8 { includeIcon } 24
							</h1>
							<span className="color-white item-value">小時內出發</span>
						</div>
					</div>
				</div>
	



				<section style={sectionStyle} ref='app_section'>
					
				</section>

				<div className={'ui basic inverted center aligned segment'}>
					<span>Copyright &copy; 2015 Lantern Project. All Rights Reserved.</span>
				</div>
			</div>
		);
	}
}

export default LandingPage;

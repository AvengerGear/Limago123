import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header.jsx';
import Banner from './Banner.jsx';
import I18n from 'Extension/I18n.jsx';

// Decorators
import { flux } from 'Decorator';

// icons
import xIconBrown from 'Source/images/x-icon-brown.png';
import xIconOrange from 'Source/images/x-icon-orange.png';
import xIconGreen from 'Source/images/x-icon-green.png';
import peopleIcon from 'Source/images/people-icon.png';
import ticketIcon from 'Source/images/ticket-icon.png';
import timeIcon from 'Source/images/time-icon.png';
import arrow from 'Source/images/arrow.png';
import pen from 'Source/images/pen.png';
import email from 'Source/images/email.png';

var sectionStyle = {
	paddingTop: '40px',
	paddingBottom: '50px'
};

var peopleColor =  {
	backgroundColor: '#BCA27D'
}

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
		var includeIconBrown = <img className="ui mini image include" src={ xIconBrown } />;
		var includeIconOrange = <img className="ui mini image include" src={ xIconOrange } />;
		var includeIconGreen = <img className="ui mini image include" src={ xIconGreen } />;

		return (
			<div className='main-page'>
				<Header ref='header' />
				<Banner />
				<section style={ sectionStyle } className="limago" ref='app_section'>
					<div className={'ui basic center aligned segment'}>
							<h1>
								Limago 
								<span className="step-number color-white bg-color-brown">1</span>
								<span className="step-number color-white bg-color-orange">2</span>
								<span className="step-number color-white bg-color-green">3</span>
							</h1>
					</div>
				</section>

				<section ref='app_section' className="section-selects">
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
										{'{'} 1 { includeIconBrown } 2 { includeIconBrown } 多 {'}'} <span className="color-black">人同行</span>
									</h1>
									<p className="text-right select-sub-title">你將有機會認識不一樣的朋友</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="section-selects">
					<div className="ui stackable two column grid limago-select flex">
						<div className="eleven wide column order-2">
							<div className="ui stackable sixteen column grid ticket-section">
								<div className="three wide column"></div>
								<div className="ten wide column section-text">
									<h1 className="select-title color-orange text-right">
										{'{'} 1 { includeIconOrange } 5 { includeIconOrange } 9 {'}'} <span className="color-black">折機票</span>
									</h1>
									<p className="text-right select-sub-title">同時享有你意想不到的折扣機票</p>
								</div>
							</div>
						</div>
						<div className="five wide column ticket-section-icon order-1">
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
										{'{'} 3 { includeIconGreen } 8 { includeIconGreen } 24 {'}'} <span className="color-black">小時內出發</span>
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
							<h2 className="description">
								LiMaGo 提供 100 個以上的獨特早鳥票，只要登入我們的會員，你就有機會馬上進行一趟美妙的旅程。
							</h2>
						</div>
					</div>
				</div>

				<div className={'ui basic center aligned segment target-space'}>
					<img className="arrow" src={ arrow } />
				</div>

				<div className={'ui basic center aligned segment user-data'}>
					<img className="ui middle aligned tiny image title-tag" src={ pen } />
					<span className="title">馬上開始你的旅程</span>
					<div className="ui stackable two column grid top-row">
						<div className="three wide column"></div>
						<div className="ten wide column">
							<div className="ui fluid icon input">
								<input type="text" placeholder="請輸入你的真實姓名" />
							</div>
						</div>
					</div>
					<div className="ui stackable three column grid top-row">
						<div className="three wide column"></div>
						<div className="five wide column">
							<div className="column">
								<div className="ui fluid icon input">
									<input type="text" placeholder="請輸入你的電話號碼" />
								</div>
							</div>
						</div>
						<div className="five wide column">
							<div className="column">
								<div className="ui fluid icon input">
									<input type="text" placeholder="請輸入E-mail" />
								</div>
							</div>
						</div>
					</div>
					<div className="ui stackable two column grid">
						<div className="three wide column"></div>
						<div className="ten wide column">
							<p className="text-left textarea-tag color-white">最想去哪裡旅行 ?</p>
							<div className="ui fluid icon input">
								<textarea rows="6" cols="250"></textarea>
							</div>
						</div>
					</div>
					<div className="ui stackable two column grid top-row">
						<div className="six wide column"></div>
						<div className="four wide column">
							<span className="btn-style btn-base btn-submit">馬上加入Limago</span>
						</div>
					</div>
				</div>

				<div className={'ui basic inverted center aligned segment footer'}>
					<img className="ui middle aligned tiny image icon" src={ email } />
					<span>contact@limago.com</span>
					<br />
					<span>Copyright &copy; 2015 Limago Project. All Rights Reserved.</span>
				</div>
			</div>
		);
	}
}

export default LandingPage;

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

var sectionStyle = {
	paddingTop: '40px',
	paddingBottom: '60px'
};

var itemSectionStyle = {
	paddingTop: '60px',
	paddingBottom: '60px'
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
		var includeIcon = <img className="ui mini image include" src={ xIconBrown } />;

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

				<section style={ itemSectionStyle } className="limago-select" ref='app_section'>
					<div className="ui stackable two column grid">
						<div className="five wide column" style={ peopleColor }>
							<div className={'ui basic center aligned segment'}>
								<img className="ui middle aligned tiny image" src={ peopleIcon } />
								<p>人數</p>
							</div>
						</div>
						<div className="eleven wide column">
							<div className="ui stackable sixteen column grid">
								<div className="three wide column"></div>
								<div className="ten wide column">
									<h1 className="select-title color-brown text-right">
										{'{'} 1 { includeIcon } 2 { includeIcon } 多 {'}'} <span className="color-black">人同行</span>
									</h1>
									<p className="text-right">你將有機會認識不一樣的朋友</p>
								</div>
							</div>
						</div>
					</div>
				</section>
				

				<div className={'ui basic inverted center aligned segment'}>
					<span>Copyright &copy; 2015 Lantern Project. All Rights Reserved.</span>
				</div>
			</div>
		);
	}
}

export default LandingPage;

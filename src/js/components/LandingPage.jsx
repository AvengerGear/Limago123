import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header.jsx';
import Banner from './Banner.jsx';
import I18n from 'Extension/I18n.jsx';

// Decorators
import { flux } from 'Decorator';

var sectionStyle = {
	paddingTop: '40px',
	paddingBottom: '60px'
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

				<div className={'ui basic inverted center aligned segment'}>
					<span>Copyright &copy; 2015 Lantern Project. All Rights Reserved.</span>
				</div>
			</div>
		);
	}
}

export default LandingPage;

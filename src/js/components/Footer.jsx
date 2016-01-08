import React from 'react';
import { Link } from 'react-router';
import I18n from 'Extension/I18n.jsx';

// Decorators
import { router, flux, i18n, preAction } from 'Decorator';

// icons
import email from 'Source/images/email.png';

@flux
@router
class Footer extends React.Component {
	render() {
		return (
			<div className={'ui basic inverted center aligned segment footer'}>
				<img className="ui middle aligned tiny image icon" src={ email } />
				<span>contact@limago.com</span>
				<br />
				<span>Copyright &copy; 2015 Limago Project. All Rights Reserved.</span>
			</div>
		);
	}
};

export default Footer;

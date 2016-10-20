import React from 'react';
import { Link } from 'react-router';
import I18n from 'Extension/I18n.jsx';

// Decorators
import { flux, router, preAction, wait } from 'Decorator';

import StudentWithTicket from './StudentWithTicket.jsx';
import EmployeeWithTicket from './EmployeeWithTicket.jsx';
import RetiredWithTicket from './RetiredWithTicket.jsx';

@flux
@router
@preAction((handle) => {
	handle.doAction('User.demoThree.getTypeCount', handle.props.params.type);
})
@wait('User')
class DemoThree extends React.Component {
	constructor(props, context) {
		super(props, context);

		var state = context.flux.getState('User');

		this.state = {
			'type': props.params.type,
			'typeCounter': state.typeCounter
		};
	}

	componentWillMount() {
		this.flux.on('store.User', this.flux.bindListener(this.onChange));
	};

	componentWillUnmount() {
		this.flux.off('store.User', this.onChange);
	};

	onChange = () => {
		var state = this.flux.getState('User');

		this.setState({
			'typeCounter': state.typeCounter
		});
	};

	render() {
		var content = <StudentWithTicket qrcode="947b282a978de2ae" />;
		if (this.state.typeCounter) {
			if(this.state.typeCounter.counter % 3 == 0) {
				content = <StudentWithTicket qrcode="947b282a978de2ae" />;
			}else if (this.state.typeCounter.counter % 3 == 1) {
				content = <EmployeeWithTicket qrcode="872cc32b89ab3824" />;
			}else if (this.state.typeCounter.counter % 3 == 2) {
				content = <RetiredWithTicket qrcode="dedb266d9c1e0347" />;
			}
		}
		return (
			<div>
				{content}
			</div>
		);
	}
};

export default DemoThree;

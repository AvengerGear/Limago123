import React from 'react';
import { Link } from 'react-router';
import I18n from 'Extension/I18n.jsx';

// Decorators
import { router, flux, i18n } from 'Decorator';

// Components
import Header from './Header.jsx';

@router
@flux
class SignUpPage extends React.Component {

	render() {
		var message;

		return (
			<div className='main-page'>
				<Header />
				<div className={'ui basic center aligned padded segment'}>
					<div className='ui hidden divider'></div>
					<div className='ui hidden divider'></div>
					<div className='ui hidden divider'></div>
					
					<div className={'ui basic center aligned padded segment'}>
						<div className='ui one column centered stackable grid'>
							<h1 className='ui header'>
								<i className='map outline icon' />
								<div className='content'>恭喜你取得專屬票券！</div>
							</h1>
						</div>
					</div>
					<div className='ui hidden divider'></div>
					<div className='ui two column centered stackable grid'>
						<div className='column'>
							<div className="ui ordered steps">
								<div className="completed step">
									<div className="content">
										<div className="title">取得帳號</div>
										<div className="description">請直接註冊</div>
									</div>
								</div>
								<div className="completed step">
									<div className="content">
										<div className="title">完成註冊</div>
										<div className="description">恭喜你取得專屬票券！</div>
									</div>
								</div>
							</div>

							<div className={'ui basic segment'}>
								<div className='ui form'>
									<div className='field'>
										<Link to='/settings' className='ui teal button'>
											會員專區
										</Link>
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

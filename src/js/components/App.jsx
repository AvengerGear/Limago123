var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

//var App = React.createClass({
class App extends React.Component {
  render() {
    return (
		<div>
			<div className={'ui top fixed inverted menu'}>
				<Link to='app'>
					<div className={'item'}>Lantern</div>
				</Link>
				<div className={'right menu'}>
					<Link to='signin'>
						<div className={'item'}>
							<i className={'sign in icon'} />
							Sign In
						</div>
					</Link>
				</div>
			</div>
			<section className={"content markdown-body"}>
				<RouteHandler/>
			</section>
		</div>
    );
  }
};
/*
        <header className={"cf"}>
          <h1>Lantern</h1>
          <nav>
            <ul>
              <li><Link to="app">Home</Link></li>
            </ul>
          </nav>
        </header>
      </div>
*/
//              <li><Link to="article" params={{id: 'about'}}>About</Link></li>

module.exports = App;

import React from 'react';
import Avatar from './avatar';
import DesktopSearchbar from './search-bar';
import AppContext from '../lib/app-context';

export default class MobileTopNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      displayName: '',
      image: '',
      bio: '',
      active: false,
      search: false
    };
  }

  componentDidMount() {
    const token = window.localStorage.getItem('jwt');
    const req = {
      method: 'GET',
      headers: {
        'X-Access-Token': token
      }
    };

    fetch('/api/user', req)
      .then(res => res.json())
      .then(user => this.setState({
        username: user.username,
        displayName: user.displayName,
        image: user.image,
        bio: user.bio
      }));
  }

  renderNavComponent() {
    const { route } = this.context;

    if (route.path === `${this.state.username}` && this.state.search === true) {
      return <DesktopSearchbar />;
    }
    if (route.path === 'home') {
      return <button type="button" className="mobile-nav-btn" onClick={this.props.onClick}>
                <Avatar
                  imageUrl={this.state.image}
                  name={this.state.displayName}
                  width="33px"
                  height="33px"
                />
              </button>;
    }
    if (route.path === `${this.state.username}` && this.state.search === false) {
      return <button type="button" className="mobile-back-btn">
              <a href="#home">
                <i className="fa-solid fa-arrow-left" />
              </a>
             </button>;
    }
  }

  render() {
    const { route } = this.context;

    let heading;
    if (route.path === 'home' && this.state.search === false) {
      heading = 'Home';
    }
    if (route.path === `${this.state.username}` && this.state.search === false) {
      heading = `${this.state.displayName}`;
    }
    return (
      <div className="row top-nav p-0 m-0 position-fixed d-lg-block d-lg-none d-xl-block d-xl-none">
        <div className="col align-items-center">
          {this.renderNavComponent()}
          <p className="mobile-nav-title pt-3">{heading}</p>
        </div>
      </div>
    );
  }
}

MobileTopNav.contextType = AppContext;

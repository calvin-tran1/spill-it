import React from 'react';
import Avatar from './avatar';
import Searchbar from './search-bar';
import AppContext from '../lib/app-context';

export default class MobileTopNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      username: '',
      displayName: '',
      image: '',
      bio: '',
      search: false
    };
    this.handleBack = this.handleBack.bind(this);
  }

  componentDidMount() {
    const token = window.localStorage.getItem('jwt');
    const req = {
      method: 'GET',
      headers: {
        'X-Access-Token': token
      }
    };

    fetch('/api/users')
      .then(res => res.json())
      .then(users => this.setState({ users }));

    fetch('/api/user', req)
      .then(res => res.json())
      .then(user => this.setState({
        username: user.username,
        displayName: user.displayName,
        image: user.image,
        bio: user.bio
      }));
  }

  componentDidUpdate(prevProps, prevState) {
    const { route } = this.context;

    if (prevState.users !== this.state.users || this.state.username !== route.path) {
      if (this.state.users.find(user => user.username === route.path)) {
        fetch(`/api/user/${route.path}`)
          .then(res => res.json())
          .then(user => this.setState({
            username: user.username,
            displayName: user.displayName,
            image: user.image,
            bio: user.bio
          }));
      }
    }
  }

  handleBack() {
    window.history.back();
  }

  renderNavComponent() {
    const { route } = this.context;
    const { mobileSearch } = this.props;

    if ((route.path === `${this.state.username}` && mobileSearch === true) || (route.path === 'home' && mobileSearch === true)) {
      return <div className="d-flex m-0 p-0">
                <button type="button" className="mobile-back-btn me-0 pe-0" onClick={this.props.back}>
                  <a>
                    <i className="fa-solid fa-arrow-left" />
                  </a>
                </button>
                <Searchbar />
              </div>;
    }
    if (route.path === 'home' && mobileSearch === false) {
      return <button type="button" className="mobile-nav-btn" onClick={this.props.onClick}>
                <Avatar
                  imageUrl={this.state.image}
                  name={this.state.displayName}
                  width="33px"
                  height="33px"
                />
              </button>;
    }

    if (route.path === `${this.state.username}` && mobileSearch === false) {
      return <button type="button" className="mobile-back-btn" onClick={this.handleBack}>
                <i className="fa-solid fa-arrow-left" />
             </button>;
    }
  }

  render() {
    const { route } = this.context;
    const { mobileSearch } = this.props;

    let heading;
    if (route.path === 'home' && mobileSearch === false) {
      heading = 'Home';
    }
    if (route.path === `${this.state.username}` && mobileSearch === false) {
      heading = `${this.state.username}`;
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

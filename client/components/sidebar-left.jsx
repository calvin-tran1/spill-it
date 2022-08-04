import React from 'react';
import Avatar from './avatar';
import SignOutModal from './sign-out-modal';
import ModalOverlay from './modal-overlay.jsx';
import AppContext from '../lib/app-context';

export default class SidebarLeft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      displayName: '',
      image: '',
      bio: '',
      active: false
    };
    this.handleClick = this.handleClick.bind(this);
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

  handleClick() {
    this.setState(prevState => ({
      active: !prevState.active
    }));
  }

  render() {
    return (
      <div className="sidebar-left">
        <ModalOverlay
          active={this.state.active ? 'modal-overlay bg-transparent' : 'd-none'}
          onClick={this.handleClick}
        />
        <nav className="my-3 mx-5">
          <ul>
            <li>
              <a href="#home">
                <i className="fa-solid fa-mug-saucer" />
              </a>
            </li>
            <li>
              <a href="#home">
                <i className="fa-solid fa-house sidebar-icon px-2">
                  <span className="nav-sidebar-text">Home</span>
                </i>
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa-solid fa-user sidebar-icon px-2">
                  <span className="nav-sidebar-text">Profile</span>
                </i>
              </a>
            </li>
            <li>
              <button type="button" className="desktop-post-btn my-4" onClick={this.props.openPost}>
                Post
              </button>
            </li>
          </ul>
        </nav>
        <SignOutModal
          username={this.state.username}
          modal={this.state.active ? 'sign-out-modal' : 'd-none'}
          arrow={this.state.active ? 'arrow-down' : 'd-none'}
          onSignOut={this.props.onSignOut}
        />
        <div className="desktop-sign-out" onClick={this.handleClick}>
          <Avatar
            imageUrl={this.state.image}
            name={this.state.username}
            width="48px"
            height="48px"
          />
          <div>
            <span className="displayname-text">
              {this.state.displayName}
            </span>
            <br />
            <span className="username-text">
              @{this.state.username}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

SidebarLeft.contextType = AppContext;

import React from 'react';
import Avatar from './avatar';

export default class SidebarLeft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      displayName: '',
      image: '',
      bio: ''
    };
  }

  componentDidMount() {
    const token = window.localStorage.getItem('react-context-jwt');
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

  render() {
    return (
      <div className="sidebar-left">
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
              <a href="#">
                <button type="button" className="desktop-post-btn my-4">
                  Post
                </button>
              </a>
            </li>
          </ul>
        </nav>
        <div className="desktop-sign-out">
          <Avatar
            imageUrl={this.state.image}
            name="test"
            width="48px"
            height="48px" />
          <div>
            <span className="displayname-text">
              {this.state.displayName}
              <br />
            </span>
            <span className="username-text">
              @{this.state.username}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

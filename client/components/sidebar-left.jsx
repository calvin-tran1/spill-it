import React from 'react';
import Avatar from './avatar';

export default class SidebarLeft extends React.Component {
  render() {
    return (
      <div className="sidebar-left">
        <nav className="my-3 mx-5">
          <ul>
            <li>
              <a href="#">
                <i className="fa-solid fa-mug-saucer" />
              </a>
            </li>
            <li>
              <a href="#">
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
            imageUrl="https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
            name="test"
            width="48px"
            height="48px" />
          <div>
            <span className="displayname-text">
              Calvin
              <br />
            </span>
            <span className="username-text">
              @calvin1
            </span>
          </div>
        </div>
      </div>
    );
  }
}

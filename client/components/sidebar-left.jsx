import React from 'react';

export default class SidebarLeft extends React.Component {
  render() {
    return (
      <nav className="my-3">
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
    );
  }
}

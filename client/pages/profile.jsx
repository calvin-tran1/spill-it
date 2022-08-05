import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';
import MobileTopNav from '../components/mobile-top-nav';
import MobileBotNav from '../components/mobile-bottom-nav';
import SidebarLeft from '../components/sidebar-left';
import DesktopSearchbar from '../components/search-bar';
import ModalOverlay from '../components/modal-overlay';
import MobileNavMenu from '../components/mobile-nav-menu';
import PostForm from '../components/post-form';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      username: '',
      active: false,
      post: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.postModal = this.postModal.bind(this);
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
      .then(res => res.text())
      .then(user => this.setState({ user, username: user.username }));
  }

  handleClick() {
    this.setState(prevState => ({
      active: !prevState.active
    }));
  }

  postModal() {
    this.setState(prevState => ({
      post: !prevState.post
    }));
  }

  render() {
    const { user, handleSignOut } = this.context;

    if (!user) return <Redirect to="" />;

    return (
      <div className="container-fluid bg-primary-color">
        <ModalOverlay
          active={this.state.active ? 'modal-overlay bg-opacity-40' : 'd-none'}
          onClick={this.handleClick}
        />
        <MobileNavMenu
          active={this.state.active ? 'mobile-nav-menu' : 'd-none'}
          onClick={this.handleClick}
        />
        <div className="row">
          <MobileTopNav onClick={this.handleClick} />
          <div className="col bg-secondary-color d-none d-lg-block">
            <SidebarLeft
              onSignOut={handleSignOut}
              openPost={this.postModal}
            />
          </div>
          <div className="w-100 d-sm-none d-md-block d-md-none d-lg-block d-lg-none d-xl-block d-xl-none" />
          <div className="main-content full-height border-left border-right bg-primary-color">
            <ModalOverlay
              active={this.state.post ? 'modal-overlay bg-opacity-40' : 'd-none'}
              onClick={this.postModal}
            />
            <PostForm
              post={this.state.post ? 'container post-modal' : 'd-none'}
              onClick={this.postModal}
            />
            <h1>Profile</h1>
          </div>
          <div className="col bg-secondary-color d-none d-lg-block">
            <DesktopSearchbar />
          </div>
          <MobileBotNav
            openPost={this.postModal}
          />
        </div>
      </div>
    );
  }
}

Profile.contextType = AppContext;

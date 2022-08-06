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
import Avatar from '../components/avatar';
import PostCard from '../components/post-card';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      username: '',
      displayName: '',
      avatar: '',
      bio: '',
      active: false,
      postForm: false,
      mobileView: false,
      posts: []
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
      .then(res => res.json())
      .then(user => this.setState({
        user,
        username: user.username,
        displayName: user.displayName,
        avatar: user.image,
        bio: user.bio
      }));

    fetch('/api/posts', req)
      .then(res => res.json())
      .then(post => {
        this.setState({ posts: post });
      });

    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
  }

  resize() {
    if (window.innerWidth <= 400) {
      return this.setState({ mobileView: true });
    }
    this.setState({ mobileView: false });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize.bind(this));
  }

  handleClick() {
    this.setState(prevState => ({
      active: !prevState.active
    }));
  }

  postModal() {
    this.setState(prevState => ({
      postForm: !prevState.postForm
    }));
  }

  render() {
    const { user, handleSignOut } = this.context;
    let posts;
    if (this.state.posts.length !== 0) {
      posts = this.state.posts.map(post => {
        return (
          <PostCard
            key={post.postId}
            avatarImg={this.state.avatar}
            avatarName={this.state.username}
            displayName={this.state.displayName}
            username={this.state.username}
            textContent={post.textContent}
            textContentClass={post.textContent !== null ? 'row m-0 p-0' : 'd-none'}
            postImg={post.image}
            postImgClass={post.image !== null ? 'row m-0 p-0' : 'd-none'}
          />
        );
      });
    }

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
              active={this.state.postForm ? 'modal-overlay bg-opacity-40' : 'd-none'}
              onClick={this.postModal}
            />
            <PostForm
              post={this.state.postForm ? 'container post-modal' : 'd-none'}
              onClick={this.postModal}
            />
            <div className="profile-banner mx-0 px-0">
              <div className="row mx-0 px-0">
                {/* <h1>{this.state.displayName}</h1> */}
              </div>
              <div className="row mx-0 px-0">
                <div className="col">
                  <Avatar
                    imageUrl={this.state.avatar}
                    name={this.state.username}
                    width={this.state.mobileView ? '85px' : '134px' }
                    height={this.state.mobileView ? '85px' : '134px'}
                  />
                </div>
                <div className="col d-flex justify-content-end m-auto">
                  <button type="submit" className="setup-profile-btn">
                    <a href="#profile-setup">
                      Set up profile
                    </a>
                  </button>
                </div>
              </div>
              <div className="row m-0 p-0">
                <div className="col m-0 p-0">
                  <p className="profile-display-name mx-1 mt-2 mb-0 p-0">{this.state.displayName}</p>
                </div>
              </div>
              <div className="row m-0">
                <div className="col m-0 p-0">
                  <p className="profile-username mx-1 mt-0 mb-0 p-0">@{this.state.username}</p>
                </div>
              </div>
              <div className="row m-0 p-0">
                <div className="col m-0 p-0">
                  <p className="profile-bio mx-1 my-2">{this.state.bio}</p>
                </div>
              </div>
              <div className="row tabs-border mt-2 mx-0 px-0">
                <div className="col mx-0 px-0">
                  <button type="button" className="posts-tab tab-active">Posts</button>
                </div>
                <div className="col d-flex justify-content-end mx-0 px-0">
                  <button type="button" className="likes-tab">Likes</button>
                </div>
              </div>
            </div>
            <div className="posts-container">
              {posts}
              {/* <PostCard
                // key={post.postId}
                avatarImg={this.state.avatar}
                avatarName={this.state.username}
                displayName={this.state.displayName}
                username={this.state.username}
                textContent="test"
                postImg="https://media.moddb.com/images/members/5/4550/4549205/duck.jpg"
              /> */}
            </div>
          </div>
          <div className="col bg-secondary-color d-none d-lg-block">
            <DesktopSearchbar />
          </div>
          <MobileBotNav openPost={this.postModal} />
        </div>
      </div>
    );
  }
}

Profile.contextType = AppContext;

import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';
import parseRoute from '../lib/parse-route';
import MobileTopNav from '../components/mobile-top-nav';
import MobileBotNav from '../components/mobile-bottom-nav';
import SidebarLeft from '../components/sidebar-left';
import Searchbar from '../components/search-bar';
import ModalOverlay from '../components/modal-overlay';
import MobileNavMenu from '../components/mobile-nav-menu';
import PostForm from '../components/post-form';
import Avatar from '../components/avatar';
import PostCard from '../components/post-card';
import dateFormat from 'dateformat';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loggedInUserId: '',
      userId: '',
      username: '',
      displayName: '',
      avatar: '',
      bio: '',
      active: false,
      postForm: false,
      mobileSearch: false,
      mobileView: false,
      posts: [],
      loggedInUserLikes: [],
      likes: [],
      likesView: false,
      deletePostId: null,
      optionsMenu: false,
      deleteModal: false,
      route: parseRoute(window.location.hash)
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleHomeView = this.handleHomeView.bind(this);
    this.postModal = this.postModal.bind(this);
    this.updatePosts = this.updatePosts.bind(this);
    this.handleMobileSearch = this.handleMobileSearch.bind(this);
    this.handleOptions = this.handleOptions.bind(this);
    this.handleResetOptions = this.handleResetOptions.bind(this);
    this.handleDeleteModal = this.handleDeleteModal.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.handlePostsTab = this.handlePostsTab.bind(this);
    this.handleLikesTab = this.handleLikesTab.bind(this);
  }

  componentDidMount() {
    const token = window.localStorage.getItem('jwt');
    const req = {
      headers: {
        'X-Access-Token': token
      }
    };

    fetch('/api/user', req)
      .then(res => res.json())
      .then(user => this.setState({
        user,
        loggedInUserId: user.userId,
        userId: user.userId,
        username: user.username,
        displayName: user.displayName,
        avatar: user.image,
        bio: user.bio
      }));

    window.addEventListener('hashchange', () => {
      this.setState({ route: parseRoute(window.location.hash) });
    });
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
  }

  componentDidUpdate(prevProps, prevState) {
    const token = window.localStorage.getItem('jwt');
    const req = {
      headers: {
        'X-Access-Token': token
      }
    };

    if (prevState.username !== this.state.username) {
      fetch(`/api/user/posts/${this.state.userId}`, req)
        .then(res => res.json())
        .then(post => {
          this.setState({ posts: post });
        });

      fetch(`/api/user/likes/${this.state.userId}`, req)
        .then(res => res.json())
        .then(likes => {
          this.setState({ likes });
        });
    }

    if (prevState.route.path !== this.state.route.path || this.state.username !== this.state.route.path) {
      fetch(`/api/user/${this.state.route.path}`)
        .then(res => res.json())
        .then(user => this.setState({
          userId: user.userId,
          username: user.username,
          displayName: user.displayName,
          avatar: user.image,
          bio: user.bio
        }));
    }

    if (prevState.loggedInUserLikes !== this.state.loggedInUserLikes || prevState.loggedInUserId !== this.state.loggedInUserId) {
      fetch(`/api/user/likes/${this.state.loggedInUserId}`, req)
        .then(res => res.json())
        .then(loggedInUserLikes => {
          this.setState({ loggedInUserLikes });
        });
    }

    if (prevState.likes !== this.state.likes) {
      fetch(`/api/user/likes/${this.state.userId}`, req)
        .then(res => res.json())
        .then(likes => {
          this.setState({ likes });
        });
    }
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

  handleHomeView() {
    this.setState({ mobileSearch: false });
  }

  postModal() {
    this.setState(prevState => ({
      postForm: !prevState.postForm
    }));
  }

  handleMobileSearch() {
    this.setState(prevState => ({
      mobileSearch: !prevState.mobileSearch
    }));
  }

  updatePosts() {
    const token = window.localStorage.getItem('jwt');
    const req = {
      headers: {
        'X-Access-Token': token
      }
    };

    fetch(`/api/user/posts/${this.state.userId}`, req)
      .then(res => res.json())
      .then(newPosts => {
        this.setState({ posts: newPosts });
      });
  }

  handleOptions(e) {
    this.setState({
      deletePostId: parseInt(e.target.getAttribute('data-post-id')),
      optionsMenu: true
    });
  }

  handleResetOptions() {
    this.setState({
      optionsMenu: false,
      deletePostId: null
    });
  }

  handleDeleteModal() {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal
    }));
  }

  handleDelete() {
    const updatePosts = this.state.posts.filter(post => {
      return post.postId !== this.state.deletePostId;
    });

    const token = window.localStorage.getItem('jwt');
    const req = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': token
      }
    };

    fetch(`/api/posts/${this.state.deletePostId}`, req)
      .then(res => {
        this.setState({
          posts: updatePosts,
          optionsMenu: false,
          deletePostId: null,
          deleteModal: false
        });
      });

  }

  handleLike(e) {
    const token = window.localStorage.getItem('jwt');

    let req;
    if (e.target.className.includes('like-active')) {
      req = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Token': token
        }
      };
    } else {
      req = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Token': token
        }
      };
    }

    fetch(`/api/likes/${parseInt(e.target.getAttribute('data-post-id'))}`, req)
      .then(res => res.json())
      .catch(err => console.error(err));
  }

  handlePostsTab() {
    this.setState({ likesView: false });
  }

  handleLikesTab() {
    this.setState({ likesView: true });
  }

  render() {

    const { user, handleSignOut } = this.context;

    if (!user) return <Redirect to="" />;

    let posts;
    if (this.state.posts.length !== 0 && this.state.likesView === false) {
      posts = this.state.posts.map(post => {
        let postOptions = false;
        if (this.state.deletePostId === post.postId) {
          postOptions = true;
        }

        let likedStatus;
        if (this.state.loggedInUserLikes.find(likedPost => likedPost.postId === post.postId)) {
          likedStatus = 'fa-solid fa-heart like-active';
        } else {
          likedStatus = 'fa-regular fa-heart';
        }
        return (
          <PostCard
            key={post.postId}
            postsOrLikesView={this.likesView ? 'd-none' : 'visible'}
            postId={post.postId}
            avatarImg={post.avatar}
            avatarName={post.username}
            displayName={post.displayName}
            username={post.username}
            date={dateFormat(post.createdAt, 'mmm d, yyyy')}
            textContent={post.textContent}
            textContentClass={post.textContent ? 'row m-0 p-0' : 'd-none'}
            postImg={post.image}
            postImgClass={post.image ? 'row m-0 p-0' : 'd-none'}
            optionsMenu={postOptions ? 'post-options-menu' : 'd-none'}
            postOptionsBtn={this.handleOptions}
            postOptionsBtnClass={postOptions ? 'd-none' : 'visible'}
            deleteBtn={this.handleDeleteModal}
            likeBtn={this.handleLike}
            likeActive={likedStatus}
          />
        );
      });
    }

    let likes;
    if (this.state.likesView === true) {
      likes = this.state.likes.map(likedPost => {
        let postOptions = false;
        if (this.state.deletePostId === likedPost.postId) {
          postOptions = true;
        }
        return (
          <PostCard
            key={likedPost.postId}
            postsOrLikesView={this.likesView ? 'd-none' : 'visible'}
            postId={likedPost.postId}
            avatarImg={likedPost.avatar}
            avatarName={likedPost.username}
            displayName={likedPost.displayName}
            username={likedPost.username}
            date={dateFormat(likedPost.createdAt, 'mmm d, yyyy')}
            textContent={likedPost.textContent}
            textContentClass={likedPost.textContent ? 'row m-0 p-0' : 'd-none'}
            postImg={likedPost.image}
            postImgClass={likedPost.image ? 'row m-0 p-0' : 'd-none'}
            optionsMenu={postOptions ? 'post-options-menu' : 'd-none'}
            postOptionsBtn={this.handleOptions}
            postOptionsBtnClass={postOptions ? 'd-none' : 'visible'}
            deleteBtn={this.handleDeleteModal}
            likeBtn={this.handleLike}
            likeActive='fa-solid fa-heart like-active'
          />
        );
      });
    }

    return (
      <div className="container-fluid bg-primary-color">
        <div className={this.state.deleteModal ? 'delete-modal py-3' : 'd-none'}>
          <span>Delete Post?</span>
          <button type="button" className="confirm-delete-btn d-block" onClick={this.handleDelete}>Delete</button>
          <button type="button" className="cancel-delete-btn d-block" onClick={this.handleDeleteModal}>Cancel</button>
        </div>
        <ModalOverlay
          active={this.state.deleteModal ? 'delete-post-modal-overlay bg-opacity-40' : 'd-none'}
          onClick={this.handleDeleteModal}
        />
        <ModalOverlay
          active={this.state.optionsMenu ? 'modal-overlay bg-transparent' : 'd-none'}
          onClick={this.handleResetOptions}
        />
        <ModalOverlay
          active={this.state.active ? 'modal-overlay bg-opacity-40' : 'd-none'}
          onClick={this.handleClick}
        />
        <MobileNavMenu
          active={this.state.active ? 'mobile-nav-menu' : 'd-none'}
          onClick={this.handleClick}
        />
        <div className="row">
          <MobileTopNav
            onClick={this.handleClick}
            mobileSearch={this.state.mobileSearch}
            back={this.handleMobileSearch}
          />
          <div className="col bg-secondary-color d-none d-lg-block">
            <SidebarLeft
              onSignOut={handleSignOut}
              openPost={this.postModal}
            />
          </div>
          <div className="main-content full-height border-left border-right bg-primary-color p-0">
            <div className="row page-head m-0 px-3">
              <div className="col my-2 mx-0 p-0">
                <span className="page-head-title m-0 p-0">Profile</span>
              </div>
            </div>
            <ModalOverlay
              active={this.state.postForm ? 'modal-overlay bg-opacity-40' : 'd-none'}
              onClick={this.postModal}
            />
            <PostForm
              post={this.state.postForm ? 'container post-modal' : 'd-none'}
              onClick={this.postModal}
              updatePosts={this.updatePosts}
            />
            <div className="profile-banner mx-0 px-0">
              <div className="row mx-0 mb-3 px-0">
                <div className="col">
                  <Avatar
                    imageUrl={this.state.avatar}
                    name={this.state.username}
                    width={this.state.mobileView ? '85px' : '134px' }
                    height={this.state.mobileView ? '85px' : '134px'}
                  />
                </div>
                <div className="col d-flex justify-content-end m-auto me-1">
                  <button type="submit" className="setup-profile-btn">
                    <a href="#profile-setup">
                      Set up profile
                    </a>
                  </button>
                </div>
              </div>
              <div className="row m-0 p-0">
                <div className="col m-0 p-0">
                  <span className="profile-display-name mx-1 mt-2 mb-0 px-3 py-0">{this.state.displayName}</span>
                </div>
              </div>
              <div className="row m-0 p-0">
                <div className="col m-0 p-0">
                  <span className="profile-username mx-1 my-0 px-3 py-0">@{this.state.username}</span>
                </div>
              </div>
              <div className="row m-0 p-0">
                <div className="col mx-0 my-1 p-0">
                  <span className="profile-bio mx-1 my-0 px-3">{this.state.bio}</span>
                </div>
              </div>
              <div className="row tabs-border mt-2 mx-0 px-3">
                <div className="col mx-0 px-0">
                  <button type="button" className={this.state.likesView ? 'posts-tab mx-1 px-0' : 'posts-tab tab-active mx-1 px-0'} onClick={this.handlePostsTab}>Posts</button>
                </div>
                <div className="col d-flex justify-content-end mx-0 px-0">
                  <button type="button" className={this.state.likesView ? 'likes-tab tab-active mx-1 px-0' : 'likes-tab mx-1 px-0'} onClick={this.handleLikesTab}>Likes</button>
                </div>
              </div>
            </div>
            <div className="posts-container">
              {this.state.likesView ? likes : posts}
              <div className="space-break" />
            </div>
          </div>
          <div className="col bg-secondary-color d-none d-lg-block">
            <Searchbar />
          </div>
          <MobileBotNav
            homeView={this.handleHomeView}
            openPost={this.postModal}
            search={this.handleMobileSearch}
          />
        </div>
      </div>
    );
  }
}

Profile.contextType = AppContext;

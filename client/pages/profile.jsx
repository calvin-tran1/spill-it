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
      following: [],
      posts: [],
      loggedInUserLikes: [],
      loggedInUserShares: [],
      likes: [],
      shares: [],
      postsAndShares: [],
      likesView: false,
      deletePostId: null,
      optionsMenu: false,
      deleteModal: false,
      unfollowModal: false,
      route: parseRoute(window.location.hash),
      forceUpdateKey: 0
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
    this.handleFollow = this.handleFollow.bind(this);
    this.handleUnfollowModal = this.handleUnfollowModal.bind(this);
    this.handleShare = this.handleShare.bind(this);
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

    if (prevState.user !== this.state.user || prevState.following !== this.state.following) {
      fetch(`/api/user/follow/${this.state.userId}`, req)
        .then(res => res.json())
        .then(following => this.setState({
          following
        }));
    }

    if (prevState.route.path !== this.state.route.path) {
      this.setState({
        mobileSearch: false,
        likesView: false,
        posts: []
      });
    }

    if (prevState.route.path !== this.state.route.path || this.state.username !== this.state.route.path || prevState.username !== this.state.username) {
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

    if (prevState.username !== this.state.username) {
      fetch(`/api/user/likes/${this.state.userId}`, req)
        .then(res => res.json())
        .then(likes => {
          this.setState({ likes });
        });

      fetch(`/api/user/shares/${this.state.userId}`, req)
        .then(res => res.json())
        .then(shares => {
          this.setState({ shares });
        });

      const reqPosts = fetch(`/api/user/posts/${this.state.userId}`, req);
      const reqShares = fetch(`/api/user/shares/${this.state.userId}`, req);

      Promise.all([reqPosts, reqShares])
        .then(responses => Promise.all(responses.map(res => res.json())))
        .then(([posts, shares]) => {
          const postsAndShares = [...posts, ...shares];

          postsAndShares.sort((a, b) => {
            const timestampA = Math.max(new Date(a.createdAt).getTime(), new Date(a.sharedAt).getTime() || 0);
            const timestampB = Math.max(new Date(b.createdAt).getTime(), new Date(b.sharedAt).getTime() || 0);

            return timestampB - timestampA;
          });

          this.setState({ postsAndShares });
        });
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

    if (prevState.loggedInUserShares !== this.state.loggedInUserShares || prevState.loggedInUserId !== this.state.loggedInUserId) {
      fetch(`/api/user/shares/${this.state.loggedInUserId}`, req)
        .then(res => res.json())
        .then(loggedInUserShares => {
          this.setState({ loggedInUserShares });
        });
    }

    if (prevState.shares !== this.state.shares) {
      const reqPosts = fetch(`/api/user/posts/${this.state.userId}`, req);
      const reqShares = fetch(`/api/user/shares/${this.state.userId}`, req);

      Promise.all([reqPosts, reqShares])
        .then(responses => Promise.all(responses.map(res => res.json())))
        .then(([posts, shares]) => {
          const postsAndShares = [...posts, ...shares];

          postsAndShares.sort((a, b) => {
            const timestampA = Math.max(new Date(a.createdAt).getTime(), new Date(a.sharedAt).getTime() || 0);
            const timestampB = Math.max(new Date(b.createdAt).getTime(), new Date(b.sharedAt).getTime() || 0);

            return timestampB - timestampA;
          });

          this.setState({ postsAndShares });
        });

      fetch(`/api/user/shares/${this.state.userId}`, req)
        .then(res => res.json())
        .then(shares => {
          this.setState({ shares });
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

    const reqPosts = fetch(`/api/user/posts/${this.state.userId}`, req);
    const reqShares = fetch(`/api/user/shares/${this.state.userId}`, req);

    Promise.all([reqPosts, reqShares])
      .then(responses => Promise.all(responses.map(res => res.json())))
      .then(([posts, shares]) => {
        const postsAndShares = [...posts, ...shares];
        this.setState({ postsAndShares });
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

  handleFollow() {
    const token = window.localStorage.getItem('jwt');

    let req;
    if (this.state.following.find(following => following.followingId === this.state.userId)) {
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

    fetch(`/api/follow/${this.state.userId}`, req)
      .then(res => res.json())
      .catch(err => console.error(err));

    this.setState({ unfollowModal: false });
  }

  handleUnfollowModal() {
    this.setState(prevState => ({
      unfollowModal: !prevState.unfollowModal
    }));
  }

  handleShare(e) {
    const token = window.localStorage.getItem('jwt');

    let req;
    if (e.target.className.includes('share-active')) {
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

    fetch(`/api/shares/${parseInt(e.target.getAttribute('data-post-id'))}`, req)
      .then(res => res.json())
      .then(() => {
        this.setState(prevState => ({
          forceUpdateKey: prevState.forceUpdateKey + 1
        }));
      })
      .catch(err => console.error(err));
  }

  render() {
    const { user, handleSignOut } = this.context;

    if (!user) return <Redirect to="" />;

    let posts;
    if (this.state.postsAndShares.length !== 0 && this.state.likesView === false) {
      const uniquePostIds = [...new Set(this.state.postsAndShares.map(post => post.postId))];
      posts = uniquePostIds.map(postId => {
        const sharedPosts = this.state.postsAndShares.filter(post => post.postId === postId);
        const latestSharedPost = sharedPosts.reduce((prev, curr) => (
          new Date(curr.createdAt) > new Date(prev.createdAt) ? curr : prev
        ));

        let postOptions = false;
        if (this.state.deletePostId === latestSharedPost.postId) {
          postOptions = true;
        }

        let sharedStatus;
        if (this.state.loggedInUserShares.find(sharedPost => sharedPost.postId === latestSharedPost.postId)) {
          sharedStatus = 'fa-solid fa-retweet share-active';
        } else {
          sharedStatus = 'fa-solid fa-retweet';
        }

        let sharedBy = '';
        let sharedByIcon = '';
        const { loggedInUserShares, shares, username, userId, loggedInUserId } = this.state;
        const isPostSharedByUser = loggedInUserShares.some(sharedPost => sharedPost.postId === latestSharedPost.postId);
        const isPostSharedByOtherUser = shares.some(sharedPost => sharedPost.postId === latestSharedPost.postId);

        if (isPostSharedByUser && isPostSharedByOtherUser && userId !== loggedInUserId) {
          sharedBy = ` You and ${username} shared`;
          sharedByIcon = 'fa-solid fa-retweet px-3';
        } else if (isPostSharedByUser) {
          sharedBy = ' You shared';
          sharedByIcon = 'fa-solid fa-retweet px-3';
        } else if (isPostSharedByOtherUser) {
          sharedBy = ` ${username} shared`;
          sharedByIcon = 'fa-solid fa-retweet px-3';
        }

        let likedStatus;
        if (this.state.loggedInUserLikes.find(likedPost => likedPost.postId === latestSharedPost.postId)) {
          likedStatus = 'fa-solid fa-heart like-active';
        } else {
          likedStatus = 'fa-regular fa-heart';
        }

        return (
          <PostCard
            key={latestSharedPost.postId}
            postsOrLikesView={this.likesView ? 'd-none' : 'visible'}
            postId={latestSharedPost.postId}
            avatarImg={latestSharedPost.avatar}
            avatarName={latestSharedPost.username}
            profileLink={`http://localhost:3000/#${latestSharedPost.username}`}
            displayName={latestSharedPost.displayName}
            username={latestSharedPost.username}
            date={dateFormat(latestSharedPost.createdAt, 'mmm d, yyyy')}
            textContent={latestSharedPost.textContent}
            textContentClass={latestSharedPost.textContent ? 'row m-0 p-0' : 'd-none'}
            postImg={latestSharedPost.image}
            postImgClass={latestSharedPost.image ? 'row m-0 p-0' : 'd-none'}
            optionsMenu={postOptions ? 'post-options-menu' : 'd-none'}
            postOptionsBtn={this.handleOptions}
            postOptionsBtnClass={postOptions ? 'd-none' : 'visible'}
            deleteBtn={this.handleDeleteModal}
            shareBtn={this.handleShare}
            shareActive={sharedPosts.indexOf(latestSharedPost) === 0 ? sharedStatus : ''}
            likeBtn={this.handleLike}
            likeActive={likedStatus}
            sharedBy={sharedPosts.indexOf(latestSharedPost) === 0 ? sharedBy : ''}
            sharedByIcon={sharedPosts.indexOf(latestSharedPost) === 0 ? sharedByIcon : ''}
          />
        );
      });
    } else {
      posts = <p />;
    }

    let likes;
    const { likesView } = this.state;
    if (likesView === true) {
      likes = this.state.likes.map(likedPost => {
        let postOptions = false;
        if (this.state.deletePostId === likedPost.postId) {
          postOptions = true;
        }

        let sharedStatus;
        if (this.state.shares.find(sharedPost => sharedPost.postId === likedPost.postId)) {
          sharedStatus = 'fa-solid fa-retweet share-active';
        } else {
          sharedStatus = 'fa-solid fa-retweet';
        }

        let likedStatus;
        if (this.state.loggedInUserLikes.find(loggedInUserLikes => loggedInUserLikes.postId === likedPost.postId)) {
          likedStatus = 'fa-solid fa-heart like-active';
        } else {
          likedStatus = 'fa-regular fa-heart';
        }

        return (
          <PostCard
            key={likedPost.postId}
            postsOrLikesView={this.likesView ? 'd-none' : 'visible'}
            postId={likedPost.postId}
            avatarImg={likedPost.avatar}
            avatarName={likedPost.username}
            profileLink={`http://localhost:3000/#${likedPost.username}`}
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
            likeActive={likedStatus}
            shareBtn={this.handleShare}
            shareActive={sharedStatus}
          />
        );
      });
    }

    let profileButton;
    if (this.state.mobileView === false && this.state.following.find(following => following.followingId === this.state.userId)) {
      profileButton =
        <button type="submit" className="following-profile-btn" onClick={this.handleFollow}>
          <span>Following</span>
        </button>;
    } else if (this.state.mobileView === true && this.state.following.find(following => following.followingId === this.state.userId)) {
      profileButton =
        <button type="submit" className="following-profile-btn" onClick={this.handleUnfollowModal}>
          <span>Following</span>
        </button>;
    } else if (this.state.loggedInUserId === this.state.userId) {
      profileButton =
        <button type="submit" className="setup-profile-btn">
          <a href="#profile-setup">
            Set up profile
          </a>
        </button>;
    } else {
      profileButton =
        <button type="submit" className="follow-profile-btn" onClick={this.handleFollow}>
          Follow
        </button>;
    }

    return (
      <div className="container-fluid bg-primary-color" key={this.state.forceUpdateKey}>
        <div className={this.state.deleteModal ? 'delete-modal py-3' : 'd-none'}>
          <span className='confirm-delete-post'>Delete Post?</span>
          <button type="button" className="confirm-delete-btn d-block" onClick={this.handleDelete}>
            Delete
          </button>
          <button type="button" className="cancel-delete-btn d-block" onClick={this.handleDeleteModal}>
            Cancel
          </button>
        </div>
        <div className={this.state.unfollowModal ? 'unfollow-modal py-3' : 'd-none'}>
          <span className="confirm-unfollow">Unfollow @{this.state.username}?</span>
          <button type="submit" className="unfollow-btn d-block" onClick={this.handleFollow}>
            Unfollow
          </button>
          <button type="button" className="cancel-delete-btn d-block" onClick={this.handleUnfollowModal}>
            Cancel
          </button>
        </div>
        <ModalOverlay
          active={this.state.deleteModal ? 'delete-post-modal-overlay bg-opacity-40' : 'd-none'}
          onClick={this.handleDeleteModal}
        />
        <ModalOverlay
          active={this.state.unfollowModal ? 'delete-post-modal-overlay bg-opacity-40' : 'd-none'}
          onClick={this.handleUnfollowModal}
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
                  {profileButton}
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

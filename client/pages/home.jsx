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
import PostCard from '../components/post-card';
import dateFormat from 'dateformat';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loggedInUserId: '',
      userId: '',
      username: '',
      active: false,
      post: false,
      mobileSearch: false,
      following: [],
      posts: [],
      shares: [],
      loggedInUserLikes: [],
      loggedInUserShares: [],
      feed: [],
      deletePostId: null,
      route: parseRoute(window.location.hash)
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleHomeView = this.handleHomeView.bind(this);
    this.postModal = this.postModal.bind(this);
    this.handleMobileSearch = this.handleMobileSearch.bind(this);
    this.updatePosts = this.updatePosts.bind(this);
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
        loggedInUserId: user.userId
      }));

    window.addEventListener('hashchange', () => {
      this.setState({ route: parseRoute(window.location.hash) });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const token = window.localStorage.getItem('jwt');
    const req = {
      method: 'GET',
      headers: {
        'X-Access-Token': token
      }
    };

    if (this.state.user === null || prevState.loggedInUserId !== this.state.loggedInUserId) {
      fetch(`/api/user/follow/${this.state.loggedInUserId}`, req)
        .then(res => res.json())
        .then(following => this.setState({
          following
        }));

    }

    if (prevState.loggedInUserLikes !== this.state.loggedInUserLikes || prevState.loggedInUserId !== this.state.loggedInUserId) {
      fetch(`/api/user/likes/${this.state.loggedInUserId}`, req)
        .then(res => res.json())
        .then(loggedInUserLikes => {
          this.setState({ loggedInUserLikes });
        });
    }

    if (prevState.loggedInUserShares !== this.state.loggedInUserShares || prevState.loggedInUserId !== this.state.loggedInUserId) {
      fetch(`/api/user/shares/${this.state.loggedInUserId}`, req)
        .then(res => res.json())
        .then(loggedInUserShares => {
          this.setState({ loggedInUserShares });
        });
    }

    if (prevState.following !== this.state.following && this.state.following.length > 0 && !this.state.isFetchPerformed) {
      const followingIds = this.state.following.map(user => user.followingId);

      const fetchFeed = followingIds.map(followingId => {
        const reqPosts = fetch(`/api/user/posts/${followingId}`, req);
        const reqShares = fetch(`/api/user/shares/${followingId}`, req);

        return Promise.all([reqPosts, reqShares])
          .then(responses => Promise.all(responses.map(res => res.json())))
          .then(([posts, shares]) => {
            return [...posts, ...shares];
          });
      });

      const fetchShares = followingIds.map(followingId => {
        return fetch(`/api/user/shares/${followingId}`, req)
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch shares');
            }
            return response.json();
          })
          .catch(error => {
            console.error('Error fetching shares:', error);
            return [];
          });
      });

      Promise.all([Promise.all(fetchFeed), Promise.all(fetchShares)])
        .then(([feedResults, sharesResults]) => {
          const feed = feedResults.flat();
          const shares = sharesResults.flat();

          feed.sort((a, b) => {
            const timestampA = Math.max(new Date(a.createdAt).getTime(), new Date(a.sharedAt).getTime() || 0);
            const timestampB = Math.max(new Date(b.createdAt).getTime(), new Date(b.sharedAt).getTime() || 0);

            return timestampB - timestampA;
          });

          this.setState({ feed, shares });
        })
        .catch(error => {
          console.error('Error fetching feed and shares:', error);
        });

      this.setState({ isFetchPerformed: true });
    }

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
      post: !prevState.post
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
      method: 'GET',
      headers: {
        'X-Access-Token': token
      }
    };

    fetch('/api/posts', req)
      .then(res => res.json())
      .then(post => {
        this.setState({ posts: post });
      });
  }

  render() {
    const { user, handleSignOut } = this.context;

    if (!user) return <Redirect to="" />;

    let posts;
    if (this.state.feed.length > 0) {
      const uniquePostIds = [...new Set(this.state.feed.map(post => post.postId))];
      posts = uniquePostIds.map(postId => {
        const sharedPosts = this.state.feed.filter(post => post.postId === postId);
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
        const userId = this.state.user.userId;
        const { loggedInUserShares, shares, username } = this.state;
        const isPostSharedByUser = loggedInUserShares.some(sharedPost => sharedPost.postId === latestSharedPost.postId);
        const isPostSharedByOtherUser = shares.some(sharedPost => sharedPost.postId === latestSharedPost.postId);

        if (isPostSharedByUser && isPostSharedByOtherUser && userId !== this.state.userId) {
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
                <span className="page-head-title m-0 p-0">Home</span>
              </div>
            </div>
            <ModalOverlay
              active={this.state.post ? 'modal-overlay bg-opacity-40' : 'd-none'}
              onClick={this.postModal}
            />
            <PostForm
              post={this.state.post ? 'container post-modal' : 'd-none'}
              onClick={this.postModal}
              updatePosts={this.updatePosts}
            />
            <div className="posts-container">
              {posts}
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

Home.contextType = AppContext;

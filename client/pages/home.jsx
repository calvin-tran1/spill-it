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
      user: '',
      loggedInUserId: '',
      username: '',
      active: false,
      post: false,
      mobileSearch: false,
      following: [],
      posts: [],
      shares: [],
      likes: [],
      loggedInUserLikes: [],
      loggedInUserShares: [],
      feed: [],
      postCardUserData: [],
      deletePostId: null,
      route: parseRoute(window.location.hash),
      forceUpdateKey: 0
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleHomeView = this.handleHomeView.bind(this);
    this.postModal = this.postModal.bind(this);
    this.handleMobileSearch = this.handleMobileSearch.bind(this);
    this.updatePosts = this.updatePosts.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.handleShare = this.handleShare.bind(this);
    this.homeRef = React.createRef();
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
        const reqLikes = fetch(`/api/user/likes/${followingId}`, req);

        return Promise.all([reqPosts, reqShares, reqLikes])
          .then(responses => Promise.all(responses.map(res => res.json())))
          .then(([posts, shares, likes]) => {
            return [...posts, ...shares, ...likes];
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

      const fetchLikes = followingIds.map(followingId => {
        return fetch(`/api/user/likes/${followingId}`, req)
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch likes');
            }
            return response.json();
          })
          .catch(error => {
            console.error('Error fetching likes:', error);
            return [];
          });
      });

      Promise.all([Promise.all(fetchFeed), Promise.all(fetchShares), Promise.all(fetchLikes)])
        .then(([feedResults, sharesResults, likesResults]) => {
          const feed = feedResults.flat();
          const shares = sharesResults.flat();
          const likes = likesResults.flat();

          feed.sort((a, b) => {
            const timestampA = Math.max(new Date(a.createdAt).getTime(), new Date(a.sharedAt).getTime() || 0);
            const timestampB = Math.max(new Date(b.createdAt).getTime(), new Date(b.sharedAt).getTime() || 0);

            return timestampB - timestampA;
          });

          this.setState({ feed, shares, likes });
        })
        .catch(error => {
          console.error('Error fetching feed and shares:', error);
        });

      this.setState({ isFetchPerformed: true });
    }

    if (prevState.feed.length !== this.state.feed.length) {
      const token = window.localStorage.getItem('jwt');
      const req = {
        method: 'GET',
        headers: {
          'X-Access-Token': token
        }
      };

      const userIdSet = new Set();
      const postCardUserIds = this.state.feed.map(post => {
        if (!userIdSet.has(post.userId)) {
          userIdSet.add(post.userId);
          return post.userId;
        }
        return null;
      }).filter(userId => userId !== null);

      Promise.all(
        postCardUserIds.map(userId => {
          return fetch(`/api/user/data/${userId}`, req)
            .then(res => res.json());
        })
      )
        .then(postCardUserDataArray => {
          this.setState({
            postCardUserData: postCardUserDataArray
          });
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });

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
    if (this.state.feed.length > 0) {
      const uniquePostIds = [...new Set(this.state.feed.map(post => post.postId))];
      posts = uniquePostIds.map(postId => {
        const sharedPosts = this.state.feed.filter(post => post.postId === postId);
        const latestSharedPost = sharedPosts.reduce((prev, curr) => (
          new Date(curr.createdAt) > new Date(prev.createdAt) ? curr : prev
        ));

        const user = this.state.postCardUserData.find(userData => userData.userId === latestSharedPost.userId);
        const avatar = user ? user.image : null;

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

        let likedStatus;
        if (this.state.loggedInUserLikes.find(likedPost => likedPost.postId === latestSharedPost.postId)) {
          likedStatus = 'fa-solid fa-heart like-active';
        } else {
          likedStatus = 'fa-regular fa-heart';
        }

        let likedOrSharedBy = '';
        let likeOrShareIcon = '';
        let username = '';
        const { loggedInUserShares, shares, likes } = this.state;
        const isPostSharedByUser = loggedInUserShares.some(sharedPost => sharedPost.postId === latestSharedPost.postId);
        const isPostSharedByOtherUser = shares.some(sharedPost => sharedPost.postId === latestSharedPost.postId);
        const isPostLikedByOtherUser = likes.some(likedPost => likedPost.postId === latestSharedPost.postId);

        if (isPostSharedByUser && isPostSharedByOtherUser) {
          const sharedPost = shares.find(sharedPost => sharedPost.postId === latestSharedPost.postId);
          if (sharedPost) {
            username = sharedPost.sharedUsername;
          }
          likedOrSharedBy = ` You and ${username} shared`;
          likeOrShareIcon = 'fa-solid fa-retweet px-3';
        } else if (isPostSharedByUser) {
          likedOrSharedBy = ' You shared';
          likeOrShareIcon = 'fa-solid fa-retweet px-3';
        } else if (isPostSharedByOtherUser) {
          const sharedPost = shares.find(sharedPost => sharedPost.postId === latestSharedPost.postId);
          if (sharedPost) {
            username = sharedPost.sharedUsername;
          }
          likedOrSharedBy = ` ${username} shared`;
          likeOrShareIcon = 'fa-solid fa-retweet px-3';
        } else if (!isPostSharedByOtherUser && isPostLikedByOtherUser) {
          const likedPost = likes.find(likedPost => likedPost.postId === latestSharedPost.postId);
          if (likedPost) {
            username = likedPost.likedUsername;
          }
          likedOrSharedBy = ` ${username} liked`;
          likeOrShareIcon = 'fa-solid fa-heart px-3';
        }

        return (
          <PostCard
            key={latestSharedPost.postId}
            postsOrLikesView={this.likesView ? 'd-none' : 'visible'}
            postId={latestSharedPost.postId}
            avatarImg={avatar}
            avatarName={latestSharedPost.username}
            profileLink={`spillit.xyz/#${latestSharedPost.username}`}
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
            sharedBy={sharedPosts.indexOf(latestSharedPost) === 0 ? likedOrSharedBy : ''}
            sharedByIcon={sharedPosts.indexOf(latestSharedPost) === 0 ? likeOrShareIcon : ''}
          />
        );
      });
    } else {
      posts = <p className="post-text-content text-center mt-3">
        Oops, find some friends to populate your home page!
      </p>;
    }

    return (
      <div className="container-fluid bg-primary-color" key={this.state.forceUpdateKey}>
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
            <div className="row page-head-home m-0 px-3">
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

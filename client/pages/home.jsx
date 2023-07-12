import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';
import MobileTopNav from '../components/mobile-top-nav';
import MobileBotNav from '../components/mobile-bottom-nav';
import SidebarLeft from '../components/sidebar-left';
import Searchbar from '../components/search-bar';
import ModalOverlay from '../components/modal-overlay';
import MobileNavMenu from '../components/mobile-nav-menu';
import PostForm from '../components/post-form';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      username: '',
      active: false,
      post: false,
      mobileSearch: false,
      following: [],
      posts: [],
      shares: [],
      postsAndShares: []
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
      .then(res => res.text())
      .then(user => this.setState({ user, username: user.username }));
  }

  componentDidUpdate(prevProps, prevState) {
    const token = window.localStorage.getItem('jwt');
    const req = {
      method: 'GET',
      headers: {
        'X-Access-Token': token
      }
    };

    fetch(`/api/user/follow/${this.state.userId}`, req)
      .then(res => res.json())
      .then(following => this.setState({
        following
      }));

    // if (this.state.following.length > 0) {
    //   const following = this.state.following;

    //   following.map(following => {
    //     const reqPosts = fetch(`/api/user/posts/${following.followingId}`, req);
    //     const reqShares = fetch(`/api/user/shares/${following.followingId}`, req);

    //     return Promise.all([reqPosts, reqShares])
    //       .then(responses => Promise.all(responses.map(res => res.json())))
    //       .then(([posts, shares]) => {
    //         const postsAndShares = [...posts, ...shares];

    //         postsAndShares.sort((a, b) => {
    //           const timestampA = Math.max(new Date(a.createdAt).getTime(), new Date(a.sharedAt).getTime() || 0);
    //           const timestampB = Math.max(new Date(b.createdAt).getTime(), new Date(b.sharedAt).getTime() || 0);

    //           return timestampB - timestampA;
    //         });

    //         this.setState({ postsAndShares });
    //       });
    //   });
    // }
    if (this.state.following.length > 0) {
      const following = this.state.following;

      Promise.all(
        following.map(following => {
          const reqPosts = fetch(`/api/user/posts/${following.followingId}`, req);
          const reqShares = fetch(`/api/user/shares/${following.followingId}`, req);

          return Promise.all([reqPosts, reqShares])
            .then(responses => Promise.all(responses.map(res => res.json())))
            .then(([posts, shares]) => {
              const postsAndShares = [...posts, ...shares];

              postsAndShares.sort((a, b) => {
                const timestampA = Math.max(new Date(a.createdAt).getTime(), new Date(a.sharedAt).getTime() || 0);
                const timestampB = Math.max(new Date(b.createdAt).getTime(), new Date(b.sharedAt).getTime() || 0);

                return timestampB - timestampA;
              });

              return postsAndShares;
            });
        })
      )
        .then(postsAndSharesArray => {
          const mergedPostsAndShares = postsAndSharesArray.flat();

          this.setState({ postsAndShares: mergedPostsAndShares });
        })
        .catch(error => {
          console.error('Error fetching posts and shares:', error);
          this.setState({ postsAndShares: [] });
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
            <article className="post">
              <p className="color-text-content">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab neque blanditiis magni temporibus repellat repudiandae aliquid pariatur sint repellendus molestias, amet odio commodi facere quae vero necessitatibus assumenda quasi? Impedit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam quibusdam temporibus nulla a expedita placeat perspiciatis, corrupti laborum veniam eius rerum tempora consequatur quisquam eos dolorum. Natus numquam quibusdam dignissimos. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam, ipsam voluptas! Nihil voluptatum, esse eius repellat nemo cum dolorum, quisquam veritatis aperiam culpa a explicabo aliquam, tenetur odio iusto officiis.
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab neque blanditiis magni temporibus repellat repudiandae aliquid pariatur sint repellendus molestias, amet odio commodi facere quae vero necessitatibus assumenda quasi? Impedit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam quibusdam temporibus nulla a expedita placeat perspiciatis, corrupti laborum veniam eius rerum tempora consequatur quisquam eos dolorum. Natus numquam quibusdam dignissimos. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam, ipsam voluptas! Nihil voluptatum, esse eius repellat nemo cum dolorum, quisquam veritatis aperiam culpa a explicabo aliquam, tenetur odio iusto officiis.
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab neque blanditiis magni temporibus repellat repudiandae aliquid pariatur sint repellendus molestias, amet odio commodi facere quae vero necessitatibus assumenda quasi? Impedit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam quibusdam temporibus nulla a expedita placeat perspiciatis, corrupti laborum veniam eius rerum tempora consequatur quisquam eos dolorum. Natus numquam quibusdam dignissimos. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam, ipsam voluptas! Nihil voluptatum, esse eius repellat nemo cum dolorum, quisquam veritatis aperiam culpa a explicabo aliquam, tenetur odio iusto officiis.
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab neque blanditiis magni temporibus repellat repudiandae aliquid pariatur sint repellendus molestias, amet odio commodi facere quae vero necessitatibus assumenda quasi? Impedit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam quibusdam temporibus nulla a expedita placeat perspiciatis, corrupti laborum veniam eius rerum tempora consequatur quisquam eos dolorum. Natus numquam quibusdam dignissimos. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam, ipsam voluptas! Nihil voluptatum, esse eius repellat nemo cum dolorum, quisquam veritatis aperiam culpa a explicabo aliquam, tenetur odio iusto officiis.
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab neque blanditiis magni temporibus repellat repudiandae aliquid pariatur sint repellendus molestias, amet odio commodi facere quae vero necessitatibus assumenda quasi? Impedit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam quibusdam temporibus nulla a expedita placeat perspiciatis, corrupti laborum veniam eius rerum tempora consequatur quisquam eos dolorum. Natus numquam quibusdam dignissimos. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam, ipsam voluptas! Nihil voluptatum, esse eius repellat nemo cum dolorum, quisquam veritatis aperiam culpa a explicabo aliquam, tenetur odio iusto officiis.
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab neque blanditiis magni temporibus repellat repudiandae aliquid pariatur sint repellendus molestias, amet odio commodi facere quae vero necessitatibus assumenda quasi? Impedit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam quibusdam temporibus nulla a expedita placeat perspiciatis, corrupti laborum veniam eius rerum tempora consequatur quisquam eos dolorum. Natus numquam quibusdam dignissimos. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam, ipsam voluptas! Nihil voluptatum, esse eius repellat nemo cum dolorum, quisquam veritatis aperiam culpa a explicabo aliquam, tenetur odio iusto officiis.
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab neque blanditiis magni temporibus repellat repudiandae aliquid pariatur sint repellendus molestias, amet odio commodi facere quae vero necessitatibus assumenda quasi? Impedit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam quibusdam temporibus nulla a expedita placeat perspiciatis, corrupti laborum veniam eius rerum tempora consequatur quisquam eos dolorum. Natus numquam quibusdam dignissimos. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam, ipsam voluptas! Nihil voluptatum, esse eius repellat nemo cum dolorum, quisquam veritatis aperiam culpa a explicabo aliquam, tenetur odio iusto officiis.
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab neque blanditiis magni temporibus repellat repudiandae aliquid pariatur sint repellendus molestias, amet odio commodi facere quae vero necessitatibus assumenda quasi? Impedit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam quibusdam temporibus nulla a expedita placeat perspiciatis, corrupti laborum veniam eius rerum tempora consequatur quisquam eos dolorum. Natus numquam quibusdam dignissimos. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam, ipsam voluptas! Nihil voluptatum, esse eius repellat nemo cum dolorum, quisquam veritatis aperiam culpa a explicabo aliquam, tenetur odio iusto officiis.
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab neque blanditiis magni temporibus repellat repudiandae aliquid pariatur sint repellendus molestias, amet odio commodi facere quae vero necessitatibus assumenda quasi? Impedit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam quibusdam temporibus nulla a expedita placeat perspiciatis, corrupti laborum veniam eius rerum tempora consequatur quisquam eos dolorum. Natus numquam quibusdam dignissimos. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam, ipsam voluptas! Nihil voluptatum, esse eius repellat nemo cum dolorum, quisquam veritatis aperiam culpa a explicabo aliquam, tenetur odio iusto officiis.
              </p>
            </article>
            <article>
              <p className="color-text-content">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab neque blanditiis magni temporibus repellat repudiandae aliquid pariatur sint repellendus molestias, amet odio commodi facere quae vero necessitatibus assumenda quasi? Impedit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam quibusdam temporibus nulla a expedita placeat perspiciatis, corrupti laborum veniam eius rerum tempora consequatur quisquam eos dolorum. Natus numquam quibusdam dignissimos. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam, ipsam voluptas! Nihil voluptatum, esse eius repellat nemo cum dolorum, quisquam veritatis aperiam culpa a explicabo aliquam, tenetur odio iusto officiis.
              </p>
            </article>
            <article>
              <p className="color-text-content">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab neque blanditiis magni temporibus repellat repudiandae aliquid pariatur sint repellendus molestias, amet odio commodi facere quae vero necessitatibus assumenda quasi? Impedit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam quibusdam temporibus nulla a expedita placeat perspiciatis, corrupti laborum veniam eius rerum tempora consequatur quisquam eos dolorum. Natus numquam quibusdam dignissimos. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam, ipsam voluptas! Nihil voluptatum, esse eius repellat nemo cum dolorum, quisquam veritatis aperiam culpa a explicabo aliquam, tenetur odio iusto officiis.
              </p>
            </article>
            <article>
              <p className="color-text-content">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab neque blanditiis magni temporibus repellat repudiandae aliquid pariatur sint repellendus molestias, amet odio commodi facere quae vero necessitatibus assumenda quasi? Impedit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam quibusdam temporibus nulla a expedita placeat perspiciatis, corrupti laborum veniam eius rerum tempora consequatur quisquam eos dolorum. Natus numquam quibusdam dignissimos. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam, ipsam voluptas! Nihil voluptatum, esse eius repellat nemo cum dolorum, quisquam veritatis aperiam culpa a explicabo aliquam, tenetur odio iusto officiis.
              </p>
            </article>
            <article>
              <p className="color-text-content">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab neque blanditiis magni temporibus repellat repudiandae aliquid pariatur sint repellendus molestias, amet odio commodi facere quae vero necessitatibus assumenda quasi? Impedit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam quibusdam temporibus nulla a expedita placeat perspiciatis, corrupti laborum veniam eius rerum tempora consequatur quisquam eos dolorum. Natus numquam quibusdam dignissimos. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam, ipsam voluptas! Nihil voluptatum, esse eius repellat nemo cum dolorum, quisquam veritatis aperiam culpa a explicabo aliquam, tenetur odio iusto officiis.
              </p>
            </article>
            <article>
              <p className="color-text-content">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab neque blanditiis magni temporibus repellat repudiandae aliquid pariatur sint repellendus molestias, amet odio commodi facere quae vero necessitatibus assumenda quasi? Impedit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam quibusdam temporibus nulla a expedita placeat perspiciatis, corrupti laborum veniam eius rerum tempora consequatur quisquam eos dolorum. Natus numquam quibusdam dignissimos. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam, ipsam voluptas! Nihil voluptatum, esse eius repellat nemo cum dolorum, quisquam veritatis aperiam culpa a explicabo aliquam, tenetur odio iusto officiis.
              </p>
            </article>
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

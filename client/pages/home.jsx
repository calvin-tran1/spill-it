import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';
import MobileTopNav from '../components/mobile-top-nav';
import MobileBotNav from '../components/mobile-bottom-nav';
import SidebarLeft from '../components/sidebar-left';
import DesktopSearchbar from '../components/search-bar';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
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
      .then(res => res.text())
      .then(user => this.setState({ user }));
  }

  render() {
    console.log(this.state.user); // eslint-disable-line
    if (!this.context.user) return <Redirect to="" />;

    return (
      <div className="container-fluid bg-primary-color">
        <div className="row">
          <MobileTopNav />
          <div className="col bg-secondary-color d-none d-lg-block">
            <SidebarLeft />
          </div>
          <div className="w-100 d-sm-none d-md-block d-md-none d-lg-block d-lg-none d-xl-block d-xl-none" />
          <div className="main-content full-height border-left border-right bg-primary-color">
            <article className="post">
              <p>
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
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab neque blanditiis magni temporibus repellat repudiandae aliquid pariatur sint repellendus molestias, amet odio commodi facere quae vero necessitatibus assumenda quasi? Impedit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam quibusdam temporibus nulla a expedita placeat perspiciatis, corrupti laborum veniam eius rerum tempora consequatur quisquam eos dolorum. Natus numquam quibusdam dignissimos. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam, ipsam voluptas! Nihil voluptatum, esse eius repellat nemo cum dolorum, quisquam veritatis aperiam culpa a explicabo aliquam, tenetur odio iusto officiis.
              </p>
            </article>
            <article>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab neque blanditiis magni temporibus repellat repudiandae aliquid pariatur sint repellendus molestias, amet odio commodi facere quae vero necessitatibus assumenda quasi? Impedit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam quibusdam temporibus nulla a expedita placeat perspiciatis, corrupti laborum veniam eius rerum tempora consequatur quisquam eos dolorum. Natus numquam quibusdam dignissimos. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam, ipsam voluptas! Nihil voluptatum, esse eius repellat nemo cum dolorum, quisquam veritatis aperiam culpa a explicabo aliquam, tenetur odio iusto officiis.
              </p>
            </article>
            <article>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab neque blanditiis magni temporibus repellat repudiandae aliquid pariatur sint repellendus molestias, amet odio commodi facere quae vero necessitatibus assumenda quasi? Impedit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam quibusdam temporibus nulla a expedita placeat perspiciatis, corrupti laborum veniam eius rerum tempora consequatur quisquam eos dolorum. Natus numquam quibusdam dignissimos. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam, ipsam voluptas! Nihil voluptatum, esse eius repellat nemo cum dolorum, quisquam veritatis aperiam culpa a explicabo aliquam, tenetur odio iusto officiis.
              </p>
            </article>
            <article>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab neque blanditiis magni temporibus repellat repudiandae aliquid pariatur sint repellendus molestias, amet odio commodi facere quae vero necessitatibus assumenda quasi? Impedit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam quibusdam temporibus nulla a expedita placeat perspiciatis, corrupti laborum veniam eius rerum tempora consequatur quisquam eos dolorum. Natus numquam quibusdam dignissimos. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam, ipsam voluptas! Nihil voluptatum, esse eius repellat nemo cum dolorum, quisquam veritatis aperiam culpa a explicabo aliquam, tenetur odio iusto officiis.
              </p>
            </article>
            <article>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab neque blanditiis magni temporibus repellat repudiandae aliquid pariatur sint repellendus molestias, amet odio commodi facere quae vero necessitatibus assumenda quasi? Impedit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam quibusdam temporibus nulla a expedita placeat perspiciatis, corrupti laborum veniam eius rerum tempora consequatur quisquam eos dolorum. Natus numquam quibusdam dignissimos. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam, ipsam voluptas! Nihil voluptatum, esse eius repellat nemo cum dolorum, quisquam veritatis aperiam culpa a explicabo aliquam, tenetur odio iusto officiis.
              </p>
            </article>
          </div>
          <div className="col bg-secondary-color d-none d-lg-block">
            <DesktopSearchbar />
          </div>
          <MobileBotNav />
        </div>
      </div>
    );
  }
}

Home.contextType = AppContext;

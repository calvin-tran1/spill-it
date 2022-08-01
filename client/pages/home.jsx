import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';
import MobileTopNav from '../components/mobile-top-nav';
import MobileBotNav from '../components/mobile-bottom-nav';
import SidebarLeft from '../components/sidebar-left';

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
      <div className="container-fluid bg-milk-brown">
        <div className="row">
          <MobileTopNav />
          <div className="col d-none d-lg-block">
            <SidebarLeft />
          </div>
          <div className="w-100 d-sm-none d-md-block d-md-none d-lg-block d-lg-none d-xl-block d-xl-none" />
          <div className="col ">
            <div className="main-content full-height" />
          </div>
          <div className="col d-none d-lg-block" />
          <MobileBotNav />
        </div>
      </div>
    );
  }
}

Home.contextType = AppContext;
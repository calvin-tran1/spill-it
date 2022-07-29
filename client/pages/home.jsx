import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';

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
      <h1>
        home
      </h1>
    );
  }
}

Home.contextType = AppContext;

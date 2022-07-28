import React from 'react';
import SignIn from './pages/sign-in';
import SignUp from './pages/sign-up';
import ProfileSetup from './pages/profile-setup';
import parseRoute from './lib/parse-route';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({ route: parseRoute(window.location.hash) });
    });
  }

  renderPage() {
    const { route } = this.state;

    if (route.path === '') {
      return <SignIn />;
    }
    if (route.path === 'sign-up') {
      return <SignUp />;
    }
    if (route.path === 'profile-setup') {
      return <ProfileSetup />;
    }
  }

  render() {
    return (
      <>
        { this.renderPage() }
      </>
    );
  }
}

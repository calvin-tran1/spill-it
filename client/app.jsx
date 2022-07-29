import React from 'react';
import AppContext from './lib/app-context';
import SignIn from './pages/sign-in';
import SignUp from './pages/sign-up';
import ProfileSetup from './pages/profile-setup';
import Home from './pages/home';
import parseRoute from './lib/parse-route';
import jwtDecode from 'jwt-decode';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAuthorizing: true,
      route: parseRoute(window.location.hash)
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({ route: parseRoute(window.location.hash) });
    });
    const token = window.localStorage.getItem('react-context-jwt');
    const user = token ? jwtDecode(token) : null;
    this.setState({ user, isAuthorizing: false });
  }

  handleSignIn(result) {
    const { user, token } = result;
    window.localStorage.setItem('react-context-jwt', token);
    this.setState({ user });
  }

  handleSignOut() {
    window.localStorage.removeItem('react-context-jwt');
    this.setState({ user: null });
  }

  renderPage() {
    const { user, route } = this.state;

    if (route.path === '') {
      return <SignIn onSignIn={this.handleSignIn} />;
    }
    if (route.path === 'sign-up') {
      return <SignUp onSignIn={this.handleSignIn} />;
    }
    if (route.path === `${user.username}/profile-setup`) {
      return <ProfileSetup />;
    }
    if (route.path === 'home') {
      return <Home />;
    }
  }

  render() {
    if (this.state.isAuthorizing) return null;
    const { user, route } = this.state;
    const { handleSignIn, handleSignOut } = this;
    const contextValue = { user, route, handleSignIn, handleSignOut };
    return (
      <AppContext.Provider value={contextValue}>
        <>
          {this.renderPage()}
        </>
      </AppContext.Provider>
    );
  }
}

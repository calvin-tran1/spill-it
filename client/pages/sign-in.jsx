import React from 'react';

export default class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();

    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    };

    fetch('/api/auth/sign-in', req)
      .then(res => res.json())
      .then(result => {
        this.props.onSignIn(result);
        window.location.hash = 'home';
      });
  }

  render() {
    return (
      <div className="container-fluid bg-milk-brown">
        <div className="row">
          <div className="col d-none d-lg-block" />
          <div className="col main-content full-height bg-milk-brown">
              <div className="logo">
                <a
                  href="#">
                  <i className="fa-solid fa-mug-saucer " />
                </a>
              </div>
              <p className="heading">
                What we sippin&apos; on today?
              </p>
              <form onSubmit={this.handleSubmit}>
                <div className="input-fields">
                  <label name="username" />
                  <input
                  required
                  type="text"
                  className="input-username-password my-3"
                  placeholder="Username"
                  name="username"
                  onChange={this.handleChange} />
                </div>
                <div className="input-fields">
                  <label name="password" />
                  <input
                  type="password"
                  className="input-username-password my-3"
                  placeholder="Password"
                  name="password"
                  onChange={this.handleChange} />
                </div>
                <button type="submit" className="sign-in-btn my-3">
                  Sign in
                </button>
                <div className="sign-in-up-divider">
                  <hr />
                  <p className="or">or</p>
                  <hr />
                </div>
                <a
                  href="#sign-up">
                  <button type="button" className="sign-up-btn my-1">
                    Sign up
                  </button>
                </a>
              </form>
          </div>
          <div className="col d-none d-lg-block" />
        </div>
      </div>
    );
  }
}

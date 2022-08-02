import React from 'react';

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      displayName: '',
      image: 'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg'
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value, displayName: this.state.username });
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

    fetch('/api/auth/sign-up', req)
      .then(res => res.json())
      .then(result => {
        this.props.onSignIn(result);
        window.location.hash = `${this.state.username}/profile-setup`;
      });
  }

  render() {
    return (
      <div className="container-fluid bg-primary-color">
        <div className="row">
          <div className="col d-none d-lg-block" />
          <div className="col main-content full-height bg-primary-color">
            <div className="logo">
              <a
                href="#">
                <i className="fa-solid fa-mug-saucer " />
              </a>
            </div>
            <p className="heading">
              Mother of pearl...
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
                required
                type="password"
                className="input-username-password my-3"
                placeholder="Password"
                name="password"
                onChange={this.handleChange} />
              </div>
              <button type="submit" className="sign-in-btn my-3 hidden">
                Sign in
              </button>
              <div className="sign-in-up-divider hidden">
                <hr />
                <p className="or">or</p>
                <hr />
              </div>
              <button type="submit" className="sign-up-btn my-1">
                Sign up
              </button>
            </form>
            </div>
          <div className="col d-none d-lg-block" />
        </div>
      </div>
    );
  }
}

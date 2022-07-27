import React from 'react';

export default class SignUp extends React.Component {
  render() {
    return (
      <div className="container-fluid bg-milk-brown">
        <div className="row">
          <div className="col d-none d-lg-block" />
          <div className="col">
            <div className="main-content full-height">
              <a
                href="#">
                <i className="fa-solid fa-mug-saucer " />
              </a>
              <p className="heading">
                What we sippin&apos; on today?
              </p>
              <div className="login-fields">
                <label name="username" />
                <input className="input-username-password my-3" placeholder="Username" />
              </div>
              <div className="login-fields">
                <label name="password" />
                <input type="password" className="input-username-password my-3" placeholder="Password" />
              </div>
              <button type="submit" className="sign-in-btn my-3 hidden">
                Sign in
              </button>
              <div className="sign-in-up-divider hidden">
                <hr />
                <p className="or">or</p>
                <hr />
              </div>
              <a
                href="#profile-setup">
                <button type="submit" className="sign-up-btn my-1">
                  Sign up
                </button>
              </a>
            </div>
          </div>
          <div className="col d-none d-lg-block" />
        </div>
      </div>
    );
  }
}

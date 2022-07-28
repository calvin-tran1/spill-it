import React from 'react';

export default class SignIn extends React.Component {

  render() {
    return (
      <div className="container-fluid bg-milk-brown">
        <div className="row">
          <div className="col d-none d-lg-block" />
          <div className="col">
            <div className="main-content full-height">
              <div className="logo">
                <a
                  href="#">
                  <i className="fa-solid fa-mug-saucer " />
                </a>
              </div>
              <p className="heading">
                What we sippin&apos; on today?
              </p>
              <div className="input-fields">
                <label name="username" />
                <input className="input-username-password my-3" placeholder="Username" />
              </div>
              <div className="input-fields">
                <label name="password" />
                <input type="password" className="input-username-password my-3" placeholder="Password" />
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
            </div>
          </div>
          <div className="col d-none d-lg-block" />
        </div>
      </div>
    );
  }
}

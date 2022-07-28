import React from 'react';
import Avatar from '../components/avatar';

export default class ProfileSetup extends React.Component {
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
                Setup profile
              </p>
              <form onSubmit={this.handleSubmit}>
                <Avatar
                  imageUrl="https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
                  name="calvin"
                />
                <div className="input-fields my-3">
                  <label className="avatar-label">
                    Change avatar
                    <input
                      type="file"
                      className="upload-avatar"
                      name="image"
                      ref={this.fileInputRef}
                      accept=".png, jpg, jpeg" />
                  </label>
                </div>
                <div className="input-fields">
                  <input
                    required
                    type="text"
                    className="input-display-name my-3"
                    placeholder="Display Name"
                    name="displayName"
                    onChange={this.handleChange} />
                </div>
                <div className="input-fields">
                  <input
                    type="text"
                    className="input-bio"
                    placeholder="Your bio"
                    name="bio"
                    onChange={this.handleChange} />
                </div>
                <button type="submit" className="finish-profile-btn my-3">
                  Finish
                </button>
              </form>
            </div>
          </div>
          <div className="col d-none d-lg-block" />
        </div>
      </div>
    );
  }
}

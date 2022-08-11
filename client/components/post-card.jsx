import React from 'react';
import Avatar from './avatar';

export default class PostCard extends React.Component {
  render() {
    return (
      <article key={this.props.key}>
        <div className="row m-0 p-0">
          <div className="col post-avatar-wrapper mb-3 px-3">
            <Avatar
              imageUrl={this.props.avatarImg}
              name={this.props.avatarName}
              width="48px"
              height="48px"
            />
          </div>
          <div className="col mx-1 my-0 p-0">
            <div className="row m-0 p-0">
              <div className="col d-flex m-0 p-0">
                <p className="post-displayname my-0 py-0">
                  {this.props.displayName}
                </p>
                <p className="post-username my-0 py-0 ps-1 pe-0">
                  @{this.props.username}
                </p>
                <i className="fa-solid fa-circle my-0 px-1" />
                <p className="post-date my-0 p-0">{this.props.date}</p>
              </div>
            </div>
            <div className={this.props.textContentClass}>
              <div className="col m-0 p-0" >
                <p className="post-text-content mt-0 mb-1">
                  {this.props.textContent}
                </p>
              </div>
            </div>
            <div className={this.props.postImgClass}>
              <div className="col mt-1 mb-0 p-0">
                <img className="post-image mb-3" src={this.props.postImg} />
              </div>
            </div>
            <div className="row m-0 p-0">
              <div className="col mx-0 mt-0 mb-1 p-0">
                <i className="fa-regular fa-comment" />
              </div>
              <div className="col d-flex justify-content-center mx-0 mt-0 mb-1 p-0">
                <i className="fa-solid fa-retweet" />
              </div>
              <div className="col d-flex justify-content-end mx-0 mt-0 mb-1 py-0 me-2">
                <i className="fa-regular fa-heart" />
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }
}

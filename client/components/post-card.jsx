import React from 'react';
import Avatar from './avatar';

export default class PostCard extends React.Component {
  render() {
    return (
      <article key={this.props.key}>
        <div className="row m-0 p-0">
          <div className="col post-avatar-wrapper">
            <Avatar
              imageUrl={this.props.avatarImg}
              name={this.props.avatarName}
              width="48px"
              height="48px"
            />
          </div>
          <div className="col m-0 p-0">
            <div className="row m-0 p-0">
              <div className="col d-flex m-0 p-0">
                <p className="post-displayname">
                  {this.props.displayName}
                </p>
                <p className="post-username px-1">
                  @{this.props.username}
                </p>
              </div>
            </div>
            <div className={this.props.textContentClass}>
              <div className="col m-0 p-0" >
                <p className="post-text-content">
                  {this.props.textContent}
                </p>
              </div>
            </div>
            <div className={this.props.postImgClass}>
              <div className="col m-0 p-0">
                <img className="post-image mb-4" src={this.props.postImg} />
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }
}

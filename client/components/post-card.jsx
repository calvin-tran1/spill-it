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
                <p className="post-username my-0 py-0 px-1">
                  @{this.props.username}
                </p>
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
                <img className="post-image mb-4" src={this.props.postImg} />
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }
}

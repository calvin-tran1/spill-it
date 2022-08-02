import React from 'react';

export default class SignOutModal extends React.Component {
  render() {
    return (
      <>
        <div className={this.props.modal} onClick={this.props.onSignOut}>
          <span>
            Sign out @{this.props.username}
          </span>
        </div>
        <div className={this.props.arrow} />
      </>
    );
  }
}

import React from 'react';
import AppContext from '../lib/app-context';

export default class SignOutModal extends React.Component {
  render() {
    const { handleSignOut } = this.context;

    return (
      <>
        <div className={this.props.modal} onClick={handleSignOut}>
          <span>
            Sign out @{this.props.username}
          </span>
        </div>
        <div className={this.props.arrow} />
      </>
    );
  }
}

SignOutModal.contextType = AppContext;

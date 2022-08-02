import React from 'react';

export default class ModalOverlay extends React.Component {
  render() {
    return (
      <>
        <div className={this.props.active} onClick={this.props.onClick} />
      </>
    );
  }
}

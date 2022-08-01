import React from 'react';
import Avatar from './avatar';

export default class MobileTopNav extends React.Component {
  render() {
    return (
      <div className="row top-nav p-0 m-0 position-fixed d-lg-block d-lg-none d-xl-block d-xl-none">
        <div className="col">
          <Avatar
            imageUrl="https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
            name="test"
            width="33px"
            height="33px" />
            <p className="mobile-nav-title">Home</p>
        </div>
      </div>
    );
  }
}

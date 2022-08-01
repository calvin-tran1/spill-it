import React from 'react';

export default class MobileBotNav extends React.Component {
  render() {
    return (
      <div className="row bot-nav p-0 m-0 position-absolute d-lg-block d-lg-none d-xl-block d-xl-none">
        <div className="col">
          <a href="#">
            <i className="fa-solid fa-house" />
          </a>
        </div>
        <div className="col text-center">
          <a href="#">
            <i className="fa-solid fa-plus" />
          </a>
        </div>
        <div className="col mobile-search-btn">
          <button type="button">
            <i className="fa-solid fa-magnifying-glass" />
          </button>
        </div>
      </div>
    );
  }
}

import React from 'react';

export default class DesktopSearchbar extends React.Component {
  render() {
    return (
      <div className="searchbar-wrapper">
        <form className="searchbar">
          <button type="submit" className="search-btn">
            <i className="fa-solid fa-magnifying-glass" />
          </button>
          <input type="text" placeholder="Search" name="searchbar" />
        </form>
      </div>
    );
  }
}

import React from 'react';

export default class DesktopSearchbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: null,
      searchResults: [],
      keystroke: ''
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(e) {

    this.setState({ keystroke: e.target.value });
    const token = window.localStorage.getItem('jwt');
    const req = {
      headers: {
        'X-Access-Token': token
      }
    };

    fetch(`/api/search/?users=${this.state.keystroke}`, req)
      .then(res => res.json())
      .then(searchResult =>
        this.setState({ searchResults: e.target.value ? searchResult : [] }));
  }

  render() {
    return (
      <div className="searchbar-wrapper">
        <form className="searchbar">
          <button type="submit" className="search-btn">
            <i className="fa-solid fa-magnifying-glass" />
          </button>
          <input type="text" placeholder="Search" name="searchbar" onChange={this.handleSearch}/>
        </form>
        <div className="search-results-container">
          <a>test</a>
        </div>
      </div>
    );
  }
}

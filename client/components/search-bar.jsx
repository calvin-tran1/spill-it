import React from 'react';
import Avatar from '../components/avatar';

export default class Searchbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: null,
      searchResults: [],
      keystroke: ''
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
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

  handleKeyPress(e) {
    e.preventDefault();

    if (this.state.searchResults.length > 0) {
      const username = this.state.searchResults[0].username;
      const newUrl = `/#${username}`;

      window.location.assign(newUrl);
    }
  }

  render() {
    let results;
    if (this.state.searchResults !== 0) {
      const searchResults = this.state.searchResults.slice(0, 8);
      results = searchResults.map(result => {
        const username = result.username;
        return (
          <a key={result.userId} className="d-flex" href={`#${username}`}>
            <div className="search-result d-flex">
              <Avatar
                imageUrl={result.image}
                name={result.username}
                width="58px"
                height="58px"
              />
              <div className="search-result-user-info-wrapper px-2">
                <span className="search-result-displayname d-block">
                  {result.displayName}
                </span>
                <span className="search-result-username d-block">
                  @{result.username}
                </span>
              </div>
            </div>
          </a>
        );
      });
    }

    return (
      <div className="searchbar-wrapper">
        <form className="searchbar" onSubmit={this.handleKeyPress}>
          <button type="submit" className="search-btn">
            <i className="fa-solid fa-magnifying-glass" />
          </button>
          <input type="text" placeholder="Search" name="searchbar" onChange={this.handleSearch} />
        </form>
        <div className="search-results-container">
          {results}
        </div>
      </div>
    );
  }
}

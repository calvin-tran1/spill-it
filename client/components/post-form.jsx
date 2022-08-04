import React from 'react';
import Avatar from './avatar';

export default class PostForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      displayName: '',
      image: '',
      bio: '',
      userId: '',
      textContent: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const token = window.localStorage.getItem('jwt');
    const req = {
      method: 'GET',
      headers: {
        'X-Access-Token': token
      }
    };

    fetch('/api/user', req)
      .then(res => res.json())
      .then(user => this.setState({
        username: user.username,
        displayName: user.displayName,
        image: user.image,
        bio: user.bio,
        userId: user.userId
      }));
  }

  handleChange(e) {
    this.setState({ textContent: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();

    const token = window.localStorage.getItem('jwt');
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': token
      },
      body: JSON.stringify(this.state)
    };

    fetch('/api/new/post/no-image', req)
      .then(res => res.json())
      .then(() => {});
  }

  render() {
    return (
      <div className={this.props.post}>
        <div className="mx-3">
          <button className="mobile-x-btn" onClick={this.props.onClick}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div className="row">
          <div className="col post-avatar mx-3 my-2">
            <Avatar
              imageUrl={this.state.image}
              name={this.state.username}
              width="48px"
              height="48px"
            />
          </div>
          <div className="col">
            <form className="my-2" onSubmit={this.handleSubmit}>
              <div className="row">
                  <label name="content" />
                  <textarea className="textarea-post-content px-2 pt-1" type="text" maxLength={280} rows={9} placeholder="What's on your mind?" onChange={this.handleChange} />
              </div>
              <div className="row">
                <div className="col">
                  <i className="fa-solid fa-image" />
                </div>
                <div className="col submit-post-btn-wrapper">
                  <button type="submit" className="submit-post-btn" onClick={this.props.onClick}>
                    Post
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

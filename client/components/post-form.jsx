import React from 'react';
import Avatar from './avatar';

export default class PostForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      displayName: '',
      avatar: '',
      bio: '',
      userId: '',
      image: null,
      textContent: '',
      textAreaSize: '100px'
    };
    this.fileInputRef = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeImage = this.handleChangeImage.bind(this);
    this.handleClearImage = this.handleClearImage.bind(this);
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
        avatar: user.image,
        bio: user.bio,
        userId: user.userId
      }));
  }

  handleClearImage() {
    this.setState({ image: null });
  }

  handleKeyDown(e) {
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
  }

  handleChange(e) {
    this.setState({ textContent: e.target.value });
  }

  handleChangeImage(e) {
    if (!e.target.files[0]) {
      return this.setState({ image: null });
    }
    this.setState({ image: URL.createObjectURL(e.target.files[0]) });
  }

  handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    const token = window.localStorage.getItem('jwt');
    let path = '/api/new/post/no-image';
    let req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': token
      },
      body: JSON.stringify(this.state)
    };

    if (this.fileInputRef.current.files[0]) {
      path = '/api/new/post';
      req = {
        method: 'POST',
        headers: {
          'X-Access-Token': token
        },
        body: formData
      };
      formData.append('image', this.fileInputRef.current.files[0]);
      formData.append('textContent', this.state.textContent);
      formData.append('userId', this.state.userId);
      formData.append('username', this.state.username);
      formData.append('displayName', this.state.displayName);
      formData.append('avatar', this.state.avatar);
    }

    fetch(path, req)
      .then(res => res.json())
      .then(() => {
        this.fileInputRef.current.value = null;
      })
      .catch(err => console.error(err));

    this.setState({ image: null, textContent: '' });
    this.props.reRender();
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
              imageUrl={this.state.avatar}
              name={this.state.username}
              width="48px"
              height="48px"
            />
          </div>
          <div className="col">
            <form className="my-2" onSubmit={this.handleSubmit}>
              <div className="row">
                <label name="content" />
                <textarea
                  className="textarea-post-content px-3 pt-1"
                  type="text"
                  maxLength={280}
                  placeholder="What's the tea?"
                  value={this.state.textContent}
                  onKeyDown={this.handleKeyDown}
                  onChange={this.handleChange}
                />
                <div className={this.state.image !== null ? 'upload-image-wrapper position-relative' : 'd-none'}>
                  <button type="button" className="clear-upload-image" onClick={this.handleClearImage}>
                    <i className="fa-solid fa-xmark color-white" />
                  </button>
                  <img
                    className="upload-image-placeholder my-2"
                    src={this.state.image}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <label name="upload-image" className="upload-image">
                    <i className="fa-solid fa-image" />
                    <input
                      type="file"
                      className="upload-image-input"
                      name="image"
                      ref={this.fileInputRef}
                      accept=".png, jpg, jpeg"
                      onChange={this.handleChangeImage}
                    />
                  </label>
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

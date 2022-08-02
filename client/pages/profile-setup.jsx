import React from 'react';
import Avatar from '../components/avatar';

export default class ProfileSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '',
      displayName: '',
      bio: ''
    };
    this.fileInputRef = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeImage = this.handleChangeImage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const token = window.localStorage.getItem('jwt');
    const req = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    };

    fetch('/api/user', req)
      .then(res => res.json())
      .then(user => this.setState({
        image: user.image,
        displayName: user.displayName,
        bio: user.bio
      }));
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleChangeImage(e) {
    if (!e.target.files) {
      return this.setState({ image: this.state.user.image });
    }
    this.setState({ image: URL.createObjectURL(e.target.files[0]) });
  }

  handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    const token = window.localStorage.getItem('jwt');
    let path = '/api/user/profile/no-image';
    let req = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      },
      body: JSON.stringify(this.state)
    };

    if (this.fileInputRef.current.files[0]) {
      path = '/api/user/profile';
      req = {
        method: 'PATCH',
        headers: {
          'x-access-token': token
        },
        body: formData
      };
      formData.append('image', this.fileInputRef.current.files[0]);
      formData.append('displayName', this.state.displayName);
      formData.append('bio', this.state.bio);
    }

    fetch(path, req)
      .then(res => res.json())
      .then(() => {
        this.fileInputRef.current.value = null;
        window.location.hash = 'home';
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div className="container-fluid bg-primary-color">
        <div className="row">
          <div className="col d-none d-lg-block" />
          <div className="col">
            <div className="main-content full-height">
              <div className="logo">
                <a
                  href="#">
                  <i className="fa-solid fa-mug-saucer " />
                </a>
              </div>
              <p className="heading">
                Setup profile
              </p>
              <form className="profile-form" onSubmit={this.handleSubmit}>
                <Avatar
                  imageUrl={this.state.image}
                  name="test"
                  width="300px"
                  height="300px" />
                <div className="input-fields my-3">
                  <label className="avatar-label">
                    Change avatar
                    <input
                      type="file"
                      className="upload-avatar"
                      name="image"
                      ref={this.fileInputRef}
                      accept=".png, .jpg, .jpeg"
                      onChange={this.handleChangeImage} />
                  </label>
                </div>
                <div className="input-fields">
                  <input
                    required
                    type="text"
                    className="input-display-name my-3"
                    placeholder="Display Name"
                    value={!this.state.displayName ? null : this.state.displayName}
                    name="displayName"
                    onChange={this.handleChange} />
                </div>
                <div className="input-fields">
                  <input
                    type="text"
                    className="input-bio"
                    placeholder={this.state.bio === null ? 'Your bio' : this.state.bio}
                    name="bio"
                    onChange={this.handleChange} />
                </div>
                <button type="submit" className="finish-profile-btn my-3">
                  Finish
                </button>
              </form>
            </div>
          </div>
          <div className="col d-none d-lg-block" />
        </div>
      </div>
    );
  }
}

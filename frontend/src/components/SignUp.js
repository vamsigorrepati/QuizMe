import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignUp.css';
import axios from 'axios';

class SignUp extends Component {
  state = {
    email: '',
    username: '',
    password: '',
    re_enter_password: '',
    show_error: false,
    error_message: 'placeholder'
  };

  isObjectEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === '') {
        return true; // Found an empty entry
      }
    }
    return false; // No empty entries found
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.state.password !== this.state.re_enter_password) {
      this.setState({ show_error: true, error_message: 'Passwords must match' });
      return
    }

    if (this.isObjectEmpty(this.state)){
      this.setState({ show_error: true, error_message: 'Please fill all fields' });
      return
    }

    // console.log(
    //   'Signing up with',
    //   this.state.username,
    //   this.state.password,
    //   this.state.email,
    // );

    const user_data = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password
    }

    axios.post("http://localhost/register", user_data)
    .then((response) => {
      const { data } = response;

      if (data.message === 'User created successfully') {

        this.props.navigate('/verification', { state: { fromApp: true } });
        window.location.reload();
      }
      else {

        this.setState({ show_error: true, error_message: data.message });
      }
    })
    .catch((error) => {

      console.error('Error during registration:', error);
      this.setState({ show_error: true, error_message: 'An error occurred during registration' });
    });

  };

  async componentDidMount() {
    axios.get("http://localhost/@me", { withCredentials: true })
    .then((response) => {
      const { data } = response;

      if (data.message === 'Logged in') {

        this.props.navigate('/');
      }
    })
    .catch((error) => {

      console.error('Error checking user login status:', error);
    });
  }

  render() {
    return (
      <div className="signup-container">
        <form className="signup-form" onSubmit={this.handleSubmit}>
          <h2>Sign Up</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={this.state.email}
            onChange={this.handleInputChange}
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={this.state.username}
            onChange={this.handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleInputChange}
          />
          <input
            type="password"
            name="re_enter_password"
            placeholder="Re-enter Password"
            value={this.state.re_enter_password}
            onChange={this.handleInputChange}
          />
          {this.state.show_error &&
          <p className="error_msg">{this.state.error_message}</p>}
          <button type="submit">Join QuizMe!</button>
        </form>
      </div>
    );
  }
}

// Functional component wrapper to use useNavigate hook
function SignUpWithNavigate(props) {
  const navigate = useNavigate();

  return <SignUp {...props} navigate={navigate} />;
}

export default SignUpWithNavigate;

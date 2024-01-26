import React, { Component } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import axios from 'axios';

class Login extends Component {
  state = {
    username: '',
    password: '',
    show_error: false,
    error_message: 'placeholder'
  };

  isObjectEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === '') {
        return true;
      }
    }
    return false;
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.isObjectEmpty(this.state)){
      this.setState({ show_error: true, error_message: 'Please fill all fields' });
      return
    }

    // console.log("Logging in with", this.state.username, this.state.password);

    const user_data = {
      username: this.state.username,
      password: this.state.password
    }

    axios.post("http://localhost/login", user_data, { withCredentials: true })
    .then((response) => {
      const { data } = response;

      // console.log(data)

      if (data.message === 'Logged in successfully') {
        this.props.navigate('/');
        window.location.reload();
      }
      else if (data.message === 'Account has not been authenticated'){
        this.props.navigate('/verification', { state: { fromApp: true } });
        window.location.reload();
      }
      else {
        this.setState({ show_error: true, error_message: data.message });
      }
    })
    .catch((error) => {
      console.error('Error during login:', error);
      this.setState({ show_error: true, error_message: 'An error occurred during login' });
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
      <div className="login-container">
        <form className="login-form" onSubmit={this.handleSubmit}>
          <h2>Login</h2>
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
          {this.state.show_error &&
          <p className="error_msg">{this.state.error_message}</p>}
          <button type="submit">Login</button>
          <div className="signup-link">
            Not a member yet? <Link to="/signup">Sign Up</Link>
          </div>
        </form>
      </div>
    );
  }
}

function LoginWithNavigate(props) {
  const navigate = useNavigate();

  return <Login {...props} navigate={navigate} />;
}

export default LoginWithNavigate;

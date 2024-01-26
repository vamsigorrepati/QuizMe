import React, { Component } from 'react';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Verification.css';
import axios from 'axios';

class Verification extends Component {
  state = {
    show_msg: false,
    msg: '',
    msg_color: '#ee6a67'
  };

  handleResendClick = (event) => {
    event.preventDefault();

    axios.get("http://localhost/resend", { withCredentials: true })
    .then((response) => {
      const { data } = response;

      // console.log(data)

      if (data.message === 'A new confirmation email has been sent') {

        this.setState({ show_msg: true, msg: data.message, msg_color: 'rgb(103 238 117)' });
      }
      else {

        this.setState({ show_msg: true, msg: data.message, msg_color: '#ee6a67' });
      }
    })
    .catch((error) => {

      console.error('Error resending confirmation', error);
      this.setState({ show_msg: true, msg: 'An error occurred while resending confirmation' });
    });

  };

  render() {
    return (
      <div className="verificationpage">
      <div className="nav-space"></div>
      <div className="scroll-box">
        <p className="section-title">Welcome to QuizMe!</p>
        <p className="text">Your account has not been verified. You must verify your account to access QuizMe's full capabilities.</p>
        <p className="text">Please check your inbox (and your spam folder) - you should have received an email with a verification link.</p>
        <div className='resend'>
          <p className="text">Didn't get the email?</p>
          <p className="link" onClick={this.handleResendClick} style={{ cursor: 'pointer', color: '#00dcff' }}>
            Resend
          </p>
        </div>
        {this.state.show_msg &&
          <p className="error_msg" style={{color: this.state.msg_color }}>{this.state.msg}</p>}
      </div>
    </div>
    );
  }
}

// Functional component wrapper to use useNavigate hook
function VerificationWithNavigate(props) {
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (state?.fromApp === undefined || state?.fromApp === false) {
      // console.log(state?.fromApp === undefined || state?.fromApp === false);
      window.location.href = '/';
    }
  }, [state]);

  return <Verification {...props} navigate={navigate} />;
}

export default VerificationWithNavigate;

import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import './Navbar.css';
import axios from "axios";

class Navbar extends Component {
  state = { 
    clicked: false, 
    isLoggedIn: false, 
    loading: true, 
    showDropdown: false,
    searchQuery: ''
  };

  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  handleSearchKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.props.navigate('/search', { state: { query: this.state.searchQuery } });
    }
  };

  routeChange = (path) => {
    if (this.state.isLoggedIn) {
      const state = path === '/create-set' ? { isEditMode: false, reset: true } : {};
      this.props.navigate(path, { state });
    } else {
      alert("Please login to use this feature!");
    }
  }
  
  handleClick = () => {
    this.setState({ clicked: !this.state.clicked });
  }

  handleLogout = () => {
    axios.get("http://localhost/logout", { withCredentials: true })
      .then((response) => {
        this.props.navigate('/');
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  }

  componentDidMount() {
    axios.get("http://localhost/@me", { withCredentials: true })
      .then((response) => {
        const { data } = response;

        if (data.message === 'Logged in') {
          this.setState({ isLoggedIn: true, loading: false, userId: data.user_id });
        } else {
          this.setState({ isLoggedIn: false, loading: false });
        }
      })
      .catch((error) => {
        console.error('Error checking user login status:', error);
        this.setState({ loading: false });
      });
  }

  toggleDropdown = () => {
    this.setState((prevState) => ({
      showDropdown: !prevState.showDropdown,
    }));
  };

  routeToProfile = () => {
    if (this.state.isLoggedIn) {
      this.props.navigate(`/profile`, { state: { userId: this.state.userId } });
    } else {
      alert("Please login to view your profile!");
    }
  }

  render() {
    const { loading, isLoggedIn } = this.state;

    if (loading) {
      return null;
    }

    return (
      <nav className="NavbarItems">
        <div className="navbar-logo">
        <a className="navbar-logo-text" href='/'>QuizMe</a>
        </div>

        <ul className={this.state.clicked ? 'nav-menu active' : 'nav-menu'}>
          <li>
            <p className="nav-links" onClick={() => this.routeChange('/library')}>Your Library</p>
          </li>
        </ul>

        <div className="search-bar">
          <i className="fa-solid fa-magnifying-glass fa-xs" style={{ color: "#ffffff", marginTop: "auto", marginBottom: "auto", marginLeft: "12px", gridColumn: 1, gridRow: 1, zIndex: 1 }}></i>
          <input 
            className="search-field" 
            placeholder="Study sets, subjects, questions"
            value={this.state.searchQuery}
            onChange={this.handleSearchChange}
            onKeyPress={this.handleSearchKeyPress}
          />
        </div>

        <ul className={this.state.clicked ? 'nav-menu-2 active' : 'nav-menu-2'}>
          <li>
            <p className="circular-link" onClick={() => this.routeChange('/create-set')}>
              <p className="nav-links-2">
                <i className="fa-regular fa-plus fa-lg" style={{ color: "#ffffff" }}></i>
              </p>
            </p>
          </li>
          <li>
          {isLoggedIn ? (
            <div className={`dropdown ${this.state.showDropdown ? 'active' : ''}`}>
              <div className="circular-link" onClick={this.toggleDropdown}>
                <p className="nav-links-2">
                  <i className="fa-regular fa-user fa-lg" style={{ color: "#ffffff" }}></i>
                </p>
              </div>
              {this.state.showDropdown && (
                <div className="dropdown-content" onClick={this.toggleDropdown}>
                  <p onClick={this.routeToProfile}>Profile</p>
                  <a href="/settings">Settings</a>
                  <a href="/privacy-policy">Privacy Policy</a>
                  <p onClick={() => this.handleLogout()}>Logout</p>
                </div>
              )}
            </div>
          ) : (
              <a className="button-link" href="/login">
                <p className="nav-links-2" style={{ color: "#ffffff" }}>Login</p>
              </a>
            )}
          </li>
        </ul>

        <div className="menu-icon" onClick={this.handleClick}>
          <i className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}></i>
        </div>
      </nav>
    );
  }
}

function NavbarWithNavigate(props) {
  const navigate = useNavigate();

  return <Navbar {...props} navigate={navigate} />;
}

export default NavbarWithNavigate;

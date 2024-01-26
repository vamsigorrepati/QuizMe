import React, { Component } from "react";
import '../styles/Library.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faMagnifyingGlass, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

class Library extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDropdownOpen: false,
      studySets: [],
      userId: null,
      active: 'Created',
      searchInput: ''
    };
  }

  handleSearchInputChange = (event) => {
    this.setState({ searchInput: event.target.value });
  };

  clearSearchInput = () => {
    // console.log("Clearing search input");
    this.setState({ searchInput: '' });
  };
  
  
  componentDidMount() {
    // console.log("Component did mount. Fetching study sets...");

    axios.get("http://localhost/@me", { withCredentials: true })
      .then((response) => {
        const { data } = response;

        if (data.message === 'Not logged in') {
          this.props.navigate('/');
        }

        else if (!data.is_confirmed){
          this.props.navigate('/verification', { state: { fromApp: true } });
        }

        else if (data.message === 'Logged in') {
          this.setState({ userId: data.user_id }, () => {
            this.fetchUserSets();
          });
        }
      })
      .catch((error) => {
        console.error('Error checking user login status:', error);
        this.setState({ loading: false });
      });
  };

  fetchUserSets = async () => {
    try {
      const user_data = {user_id: this.state.userId}
      const response = await axios.post("http://localhost/userdecks", user_data, { withCredentials: true });
      const { data } = response;

      if (data.message === 'Got user decks') {
        const decks = data.decks
        const studySets = decks.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        this.setState({ studySets });
        this.setState({ active: 'Created'})
      }

      this.setState({isDropdownOpen: false})

    } catch (error) {
      console.error('Error getting recents:', error);
    }
  };

  fetchRecentSets = async () => {
    try {
      const response = await axios.get("http://localhost/recents", { withCredentials: true });
      const { data } = response;

      if (data.message === 'Got recents' && data.is_confirmed) {
          const studySets = data.decks
          this.setState({ studySets });
          this.setState({ active: 'Recents'})
      }

      this.setState({isDropdownOpen: false})

    } catch (error) {
      console.error('Error getting recents:', error);
    }
  };

  fetchFavoriteSets = async () => {
    try {
      const user_data = {
        user_id: this.state.userId,
    }
      const response = await axios.post("http://localhost/getfavorites", user_data, { withCredentials: true });
      const { data } = response;

      if (data.message === 'Got favorite decks') {
          const studySets = data.decks
          this.setState({ studySets });
          this.setState({ active: 'Favorites'})
      }
      
      this.setState({isDropdownOpen: false})

    } catch (error) {
      console.error('Error getting recents:', error);
    }
  };

  toggleDropdown = () => {
    this.setState(prevState => ({
      isDropdownOpen: !prevState.isDropdownOpen
    }));
  };

  renderCardItem = (studySet) => {
    if (studySet.title.toLowerCase().includes(this.state.searchInput.toLowerCase())) {
      return (
        <Link to={`/decks/${studySet.deck_id}`} className="card-item-link">
          <div className="card-item" key={studySet.deck_id}>
            <div className="card-item-top">
              <span className="card-item-terms">{studySet.numTerms} terms</span>
              <span className="card-item-user">{studySet.user || 'Unknown'}</span>
            </div>
              <div className="card-item-title">{studySet.title}</div>
          </div>
        </Link>
      );
    }
    return null;  
  };

  render() {
    // console.log("Rendering library with studySets:", this.state.studySets);

    return (
      <div className="library-page">
        <div className="nav-space"></div>
        <div className="dropdown-search-container">
          <div className="dropdown">
            <button onClick={this.toggleDropdown} className="dropdown-button">
              {this.state.active}    <FontAwesomeIcon icon={faAngleDown} className="dropdown-icon"/>
            </button>
            {this.state.isDropdownOpen && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={this.fetchUserSets}>Created</button>
                <button className="dropdown-item" onClick={this.fetchRecentSets}>Recent</button>
                <button className="dropdown-item" onClick={this.fetchFavoriteSets}>Favorites</button>
              </div>
            )}
          </div>

          <div className="search-bar-container">
            <input
              type="text"
              className="search-bar"
              placeholder="Search your sets"
              onChange={this.handleSearchInputChange}
              value={this.state.searchInput}
            />
            <FontAwesomeIcon
              icon={this.state.searchInput ? faTimes : faMagnifyingGlass}
              className="search-icon"
              onClick={this.state.searchInput ? this.clearSearchInput : undefined}
            />
          </div>
        </div>
        <div className="sets-container">
          Sets
        </div>
        <div className="cards-container">
         {this.state.studySets.map(this.renderCardItem)}
        </div>
      </div>
    );
  }
}

function LibraryWithNavigate(props) {
  const navigate = useNavigate();

  return <Library {...props} navigate={navigate} />;
}

export default LibraryWithNavigate;

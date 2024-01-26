import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Profile.css';

function ProfilePage() {
  const [studySets, setStudySets] = useState([]);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const passedUserId = location.state?.userId;

  useEffect(() => {
    const fetchUserData = async () => {
      const isOwnProfile = !passedUserId;
      const profileUrl = isOwnProfile ? "http://localhost/@me" : `http://localhost/profile/${passedUserId}`;
  
      try {
        const response = await axios.get(profileUrl, { withCredentials: true });
        const { data } = response;
  
        if ((isOwnProfile && data.message === 'Logged in' && data.is_confirmed) ||
            (!isOwnProfile && data.message === 'User found')) {
              setUsername(data.username);
  
              const userIdToFetch = isOwnProfile ? data.user_id : passedUserId;
              const userSetsResponse = await axios.post("http://localhost/userdecks", { user_id: userIdToFetch }, { withCredentials: true });
              
              if (userSetsResponse.data.message === 'Got user decks') {
                setStudySets(userSetsResponse.data.decks);
              }
        } else {
          if (isOwnProfile) {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [navigate, passedUserId]);

  const renderStudySet = (studySet) => {
    return (
      <Link to={`/decks/${studySet.deck_id}`} key={studySet.deck_id} className="card-item-link">
        <div className="card-item">
          <div className="card-item-top">
            <span className="card-item-terms">{studySet.numTerms} terms</span>
            <span className="card-item-user">{studySet.user || 'Unknown'}</span>
          </div>
          <div className="card-item-title">{studySet.title}</div>
        </div>
      </Link>
    );
  };

  return (
    <div className="library-page">
      <div className="nav-space"></div>
      <div className="profile-search-container">
        <div className="circular-profile">
            <div className="profile-letter">{username.charAt(0).toUpperCase()}</div>
            <div className="username-display">{username}</div>
        </div>
      </div>
      <div className="sets-container">
        Your Sets
      </div>
      <div className="cards-container">
          {studySets.map(renderStudySet)}
      </div>
    </div>
  );
}

export default ProfilePage;

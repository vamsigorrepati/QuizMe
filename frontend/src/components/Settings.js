import React, { useState, useEffect } from 'react';
import '../styles/Settings.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Settings = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleDeleteAccount = () => {
        const isConfirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");

        if (isConfirmed) {
            axios.get("http://localhost/deleteuser", { withCredentials: true })
            .then((response) => {
                const { data } = response;

                if (data.message === 'Account deleted successfully') {
                    alert("Account deleted successfully!")
                    // console.log("Account deleted!");

                    setTimeout(() => {
                        navigate('/');
                        window.location.reload();
                    }, 5000);
                }
            })
            .catch((error) => {
                console.error('Error during account deletion:', error);
            });
        }
    };

    useEffect(() => {
        const checkLoginStatus = async () => {
          try {
            const response = await axios.get("http://localhost/@me", { withCredentials: true });
            const { data } = response;

            if (data.message === 'Not logged in') {
              navigate('/');
              setIsLoading(false)
            }

            else if (!data.is_confirmed){
              navigate('/verification', { state: { fromApp: true } });
              setIsLoading(false)
            }

            else if (data.message === 'Logged in') {
              setUsername(data.username)
              setIsLoading(false)
            }
          } catch (error) {
            console.error('Error checking user login status:', error);
          }
        };
        checkLoginStatus();
      }, [navigate, username]);

    if (isLoading) {
    return null;
    }

    return (
      <div className="settings-container">
          <div className="nav-space"></div>
          <form className="settings-form">
              <h2 style={{textAlign: 'center'}}>Settings</h2>
              <div className="account-deletion">
                <h3>
                    Permanently delete {username}
                </h3>
                <p style={{marginBottom: "10px"}}>
                    Be careful - this will delete all your data and cannot be undone.
                </p>
                <div className="deletion-container">
                    <button className="deletion-button" onClick={handleDeleteAccount}>
                        <FontAwesomeIcon className="deletion-icon" icon={faXmark} size="xl" />
                        <p>Delete Account</p>
                    </button>
                </div>
              </div>
        </form>
      </div>
    );
  };

  export default Settings;
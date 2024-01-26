import { Component, useEffect, useState } from "react";
import { ScrollItems, Dates } from "./ScrollItems";
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import axios from "axios";

class CardItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovered: false,
      isMaxRight: false,
      isMaxLeft: true,
      isScrollEnabled: false,
      recentDecks: [],
      popularDecks: [],
      popularCreators: [],
      popularCards: []
    };
  }
  componentDidMount() {
    this.fetchDeckData();
  }

  fetchDeckData = async () => {
    try {
      const response = await axios.get("http://localhost/populardecks",{ withCredentials: true });
      const { data } = response;

      if (data.message === 'Got popular decks') {
        const popularDecks = data.decks
        this.setState({ popularDecks });
      }
    } catch (error) {
      console.error('Error getting popular creators:', error);
    }


    try {
      const response = await axios.get("http://localhost/recents", { withCredentials: true });
      const { data } = response;

      if (data.message === 'Got recents' && data.is_confirmed) {
        const recentDecks = data.decks
        this.setState({ recentDecks });
      }
    } catch (error) {
      console.error('Error getting recents:', error);
    }

    try {
      const response = await axios.get("http://localhost/popularcreators",{ withCredentials: true });
      const { data } = response;

      if (data.message === 'Got popular creators') {
        const popularCreators = data.users
        this.setState({ popularCreators });
      }
    } catch (error) {
      console.error('Error getting popular creators:', error);
    }

    try {
      const response = await axios.get("http://localhost/popularcards",{ withCredentials: true });
      const { data } = response;

      if (data.message === 'Got popular cards') {
        const popularCards = data.cards
        this.setState({ popularCards });
      }
    } catch (error) {
      console.error('Error getting popular cards:', error);
    }
  };

  handleMouseEnter = () => {
    this.setState({ isHovered: true });
  };

  handleMouseLeave = () => {
    this.setState({ isHovered: false });
  };

  disableScroll = () => {
    this.setState({ isScrollEnabled: false });
  };

  enableScroll = () => {
    this.setState({ isScrollEnabled: true });
  };

  handleButtonClick = (direction) => {
    this.enableScroll();
    const cardSpace = this.cardSpaceRef;
    const scrollAmount = 380;
    if (direction === 'right') {
      cardSpace.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    } else if (direction === 'left') {
      cardSpace.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
    this.disableScroll();
  };

  handleScroll = () => {
    const cardSpace = this.cardSpaceRef;
    const isMaxRight = ! (cardSpace.scrollLeft + cardSpace.clientWidth < cardSpace.scrollWidth);
    const isMaxLeft = cardSpace.scrollLeft === 0;
    this.setState({ isMaxRight, isMaxLeft });
  };

  handleCardClick = (deckId) => {
    this.props.navigate(`/decks/${deckId}`);
  };

  handleCreatorClick = (userId) => {
    this.props.navigate(`/profile`, { state: { userId: userId } });
  };

  render() {
    const { item } = this.props;
    const {
      isHovered,
      isMaxRight,
      isMaxLeft,
      isScrollEnabled,
      recentDecks,
      popularDecks,
      popularCreators,
      popularCards
    } = this.state;

    const isRecentActivity = item.itemName === 'Recent Activity';
    const isPopularFlashcardSets = item.itemName === 'Popular Flashcard Sets';
    const isPopularQuestions = item.itemName === 'Popular Questions';

    const currentData = isRecentActivity
      ? this.state.recentDecks
      : isPopularFlashcardSets
      ? this.state.popularDecks
      : isPopularQuestions
      ? this.state.popularCards
      : this.state.popularCreators;

    return (
      <div
        className="card-space"
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onScroll={this.handleScroll}
        ref={(ref) => (this.cardSpaceRef = ref)}
        style={{ overflowX: isScrollEnabled ? 'auto' : 'hidden' }}
      >
        {isRecentActivity
          ? recentDecks.map((deck, index) => (
              <div className="card" key={index} onClick={() => this.handleCardClick(deck.deck_id)}>
                {deck.title && <p className="card-title">{deck.title}</p>}
                {deck.description && <p className="card-description">{deck.description}</p>}
                {deck.numTerms && <p className="term-count">{deck.numTerms} term(s)</p>}
                {deck.user && <p className="card-user">{deck.user}</p>}
              </div>
            ))
          : isPopularFlashcardSets
          ? popularDecks.map((deck, index) => (
              <div className="card" key={index} onClick={() => this.handleCardClick(deck.deck_id)}>
                {deck.title && <p className="card-title">{deck.title}</p>}
                {deck.description && <p className="card-description">{deck.description}</p>}
                <div className="stats">
                {deck.numTerms && <p className="term-count">{deck.numTerms} term(s)</p>}
                {deck.numFavorites && <p className="term-count">{deck.numFavorites}</p>}
                </div>
                {deck.user && <p className="card-user">{deck.user}</p>}
              </div>
            ))
          : isPopularQuestions
          ? popularCards.map((card, index) => (
            <div className="card" key={index} onClick={() => this.handleCardClick(card.deck_id)}>
              {card.question && <p className="card-title">{card.question}</p>}
              {card.answer && <p className="card-description">{card.answer}</p>}
            </div>
          ))
          : item.itemName === 'Top Creators'
          ? popularCreators.map((creator, index) => (
              <div className="card" key={index} onClick={() => this.handleCreatorClick(creator.user_id)}>
                <div className="user-icon">
                <p>{creator.username.charAt(0).toUpperCase()}</p>
                </div>
                {creator.numFavorites && <p className="term-count">{creator.numFavorites}</p>}
                {creator.username && <p className="card-user">{creator.username}</p>}
              </div>
            ))
          : item.itemData.map((cardItem, index) => (
              <div className="card" key={index}>
                {cardItem.title && <p className="card-title">{cardItem.title}</p>}
                {cardItem.numTerms && <p className="term-count">{cardItem.numTerms} terms</p>}
                {cardItem.User && <p className="card-user">{cardItem.User}</p>}
              </div>
            ))}
        {isHovered && !isMaxRight && currentData.length >= 4 && (
          <div className="next-background">
            <div className="circular-button" onClick={() => this.handleButtonClick('right')}>
              <p className="next-button">
                <i className="fa-solid fa-chevron-right fa-lg" style={{ color: "#ffffff" }}></i>
              </p>
            </div>
          </div>
        )}
        {isHovered && !isMaxLeft && (
          <div className="prev-background">
            <div className="circular-button" onClick={() => this.handleButtonClick('left')}>
              <p className="prev-button">
                <i className="fa-solid fa-chevron-left fa-lg" style={{ color: "#ffffff" }}></i>
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
}

function Home () {
  const datesArray = Dates();
  const navigate = useNavigate();

  const [userId, setUserId] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get("http://localhost/@me", { withCredentials: true });
        const { data } = response;

        if (data.message === 'Logged in' && data.is_confirmed) {
          setUserId(data.user_id)
          setIsLoggedIn(true)
          setIsLoading(false)
        } else {
          setUserId(null)
          setIsLoggedIn(false)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error checking user login status:', error);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return null;
  }
    return (
      <div className="homepage">
        <div className="nav-space"></div>
        {ScrollItems.map((item, index) => (
          <div>
          {(item.itemName !== 'Recent Activity' || isLoggedIn) && <div className="scroll-box" key={index}>
            <p className="section-title">{item.itemName}</p>
            <br />
            <CardItem item={item} userId={userId} navigate={navigate} key={index} />
            {item.itemName === 'Recent Activity' &&
            <div className="streak">
              <div className="streak-image">
                <div className="flame">
                <i className="fa-solid fa-fire" style={{color: "#ff9837", fontSize: "130px",}}></i>
                </div>
                <div className="star">
                <i className="fa-solid fa-star" style={{color: "#fedf46", fontSize: "70px", alignSelf: "center", margin: "auto"}}></i>
                </div>
                <div className="streak-num">
                <p className="streak-number">5</p>
                </div>
              </div>
              <div className="streak-text">
                <p className="streak-days">5-day streak</p>
                <p className="streak-encouragement">Study tomorrow to keep your streak going!</p>
              </div>
              <div className="streak-calendar">
              {datesArray.map((item, index) => (
                <div className="weekday">
                  <p className="streak-week">{item.day}</p>
                  <p className="streak-date">{item.date}</p>
                  {item.current && <p className="selected-date"></p>}
                </div>
              ))}
              </div>
            </div>
            }
          </div>}
          </div>
        ))}
      </div>
    );
}

export default Home;

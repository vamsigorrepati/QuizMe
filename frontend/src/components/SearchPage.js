import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/SearchPage.css';

function CardPreview({ card }) {
  const hasCards = Array.isArray(card?.cards) && card.cards.length > 0;
  
  const cardsList = hasCards ? (
    card.cards.map((card, index) => (
      <div key={index} className="term-item">
        <strong className="term-question">{card.question}</strong>
        <p className="term-answer">{card.answer}</p>
      </div>
    ))
  ) : (
    <p>No cards available.</p>
  );

  return (
    <div className="card-preview">
        <h1 className="preview-title">{card.title}</h1>
        <div className="terms-container">{cardsList}</div>
    </div>
  );
}

function SearchResultCard({ card, navigate, setPreviewCard }) {
  const handlePreviewClick = (e) => {
    e.stopPropagation();
    setPreviewCard(card);
  };

  return (
    <div className="card" onClick={() => navigate(`/decks/${card.deck_id}`)}>
      <h3 className="card-title">{card.title}</h3>
      <p className="card-description">{card.description}</p>
      <p className="term-count">{card.numTerms} term(s)</p>
      <p className="card-user">Created by {card.user}</p>
      <button className="preview-button" onClick={handlePreviewClick}>Preview</button>
    </div>
  );
}

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [previewCard, setPreviewCard] = useState(null);

  const fetchCards = async (searchQuery) => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost/search', {
        params: { query: searchQuery },
        withCredentials: true
      });
      setCards(response.data);
        if (response.data && response.data.length > 0) {
          setPreviewCard(response.data[0]);
        }
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const locationQuery = location.state?.query;
    if (locationQuery) {
      setQuery(locationQuery);
      fetchCards(locationQuery);
    }
  }, [location.state]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (cards.length === 0) {
    return (
      <div className="search-page">
        <div className="nav-space"></div>
        <div className="No-Result">
          <h2 style={{marginTop:'40px'}}>No results for "{query}".</h2>
        </div>
    </div>
    );
  }

  return (
    <div className="search-page">
      <div className="nav-space"></div>   
      <div className="setpage-title">
        <h2>Study Sets</h2>
        <div className="preview-title-container">
          <h2>Preview</h2>
        </div>
      </div>
  
          <div className="content-container">
              <div className="search-results">
                  {cards.map(card => (
                      <SearchResultCard 
                          key={card.deck_id} 
                          card={card} 
                          navigate={navigate} 
                          setPreviewCard={setPreviewCard} 
                      />
                  ))}
              </div>
              <div className="preview-container">
                  {previewCard && <CardPreview card={previewCard} />} 
              </div>
          </div>
      </div>
  );
};

export default SearchPage;

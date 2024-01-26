import React, { useState, useEffect, useMemo} from 'react';
import '../styles/CreateSet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripLines, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function CreateSet () {

  // ----- State Declarations -----
  const [userId, setUserId] = useState([]);
  const [removedCardIds, setRemovedCardIds] = useState([]);

  // ----- Router Hooks -----
  const location = useLocation();
  const navigate = useNavigate();

  // ----- Constants and Initial States -----
  const isEditMode = location.state?.isEditMode || false;
  const { setData, deckId } = location.state || {};
  
  const defaultTerms = useMemo(() => [
    { term: '', definition: '', isDeleting: false },
    { term: '', definition: '', isDeleting: false },
    { term: '', definition: '', isDeleting: false },
  ], []);

  // Determine initial deck data based on whether it's edit mode
  const initialDeckData = isEditMode && location.state?.setData ? {
    title: location.state.setData.title,
    description: location.state.setData.description
  } : {
    title: '',
    description: ''
  };

  // Determine initial data based on whether it's edit mode
  const initialData = isEditMode && setData ? setData.cards.map(card => ({
  term: card.question,
  definition: card.answer,
  card_id: card.card_id,
  isDeleting: false
  })) : defaultTerms;

  const [termDefinitions, setTermDefinitions] = useState(initialData);
  const [deck, setDeck] = useState(initialDeckData);

  // ----- useEffect Hooks -----
  useEffect(() => {
    if (location.state?.reset) {
      const newInitialData = defaultTerms;
      const newInitialDeckData = {
        title: '',
        description: ''
      };

      setTermDefinitions(newInitialData);
      setDeck(newInitialDeckData);
    }
  }, [location.state, defaultTerms]); // Include defaultTerms here

  useEffect(() => {
    // Function to adjust the height of textareas based on their scrollHeight
    const adjustTextareaHeight = () => {
      const textareas = document.querySelectorAll('.term-input, .definition-input');
      textareas.forEach(textarea => {
        textarea.style.height = 'auto'; // Reset the height
        const scrollHeight = textarea.scrollHeight;
        textarea.style.height = scrollHeight + 'px'; // Set the height based on content
        textarea.style.overflowY = scrollHeight >= 400 ? 'scroll' : 'hidden';
      });
    };

    // Call the function to adjust textarea heights
    adjustTextareaHeight();
  }, [termDefinitions]);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get("http://localhost/@me", { withCredentials: true });
        const { data } = response;
  
        if (data.message === 'Not logged in') {
          navigate('/');
        }
  
        else if (!data.is_confirmed){
          navigate('/verification', { state: { fromApp: true } });
        }
  
        else if (data.message === 'Logged in') {
          setUserId(data.user_id)
        }
      } catch (error) {
        console.error('Error checking user login status:', error);
      }
    };
  
    checkLoginStatus();
  }, [navigate, userId]);


  // ----- Card Management Functions -----
  const addNewCard = () => {
    setTermDefinitions((prevTermDefinitions) => [
      ...prevTermDefinitions,
      { term: '', definition: '' },
    ]);
  };

  const deleteCard = (index, termDefinitions, setTermDefinitions, removedCardIds, setRemovedCardIds) => {
    const card = termDefinitions[index];
    if (card && card.card_id) {
      setRemovedCardIds([...removedCardIds, card.card_id]);
    }

    const updatedTermDefinitions = termDefinitions.map((item, i) => {
      if (i === index) {
        return { ...item, isDeleting: true };
      }
      return item;
    });
    setTermDefinitions(updatedTermDefinitions);

    setTimeout(() => {
      setTermDefinitions(termDefinitions.filter((_, i) => i !== index));
    }, 500); // Assuming 500ms is the fade-out duration
  };

  const deleteDeck = async (deckId) => {
    if (window.confirm('Are you sure you want to delete this deck?')) {
      try {
        const response = await axios.delete(`http://localhost/decks/${deckId}`);
        if (response.data.message === 'Deck deleted successfully') {
          navigate('/library'); // Redirect to library or appropriate path after deletion
        } else {
          console.error('Unexpected server response:', response.data);
        }
      } catch (error) {
        console.error('Error deleting deck:', error);
      }
    }
  };  

  const handleInputChange = (index, key, value) => {
    const updatedTermDefinitions = [...termDefinitions];
    updatedTermDefinitions[index][key] = value;
    setTermDefinitions(updatedTermDefinitions);
  };

  const renderTermDefinitionCard = (card, index) => (
    <div key={index} index={index} className={`card-wrapper ${card.isDeleting ? 'fade-out' : ''}`}>
      <div className="numbering-box">
        <span className="numbering-label">{index + 1}</span>
        <div className="icon-container">
          <FontAwesomeIcon icon={faGripLines} className="grip-icon" style={{marginRight: '15px'}}/>
          <FontAwesomeIcon icon={faTrash} className="trash-icon" 
          onClick={() => deleteCard(index, termDefinitions, setTermDefinitions, removedCardIds, setRemovedCardIds)} />
        </div>
      </div>

      <div className="term-definition-container">
        <div className="input-container">
          <textarea
            className="term-input"
            placeholder="Enter term"
            value={card.term}
            onChange={(e) => handleInputChange(index, 'term', e.target.value)}
          ></textarea>
          <label className="input-label">TERM</label>
        </div>
        <div className="input-container">
          <textarea
            className="definition-input"
            placeholder="Enter definition"
            value={card.definition}
            onChange={(e) => handleInputChange(index, 'definition', e.target.value)}
          ></textarea>
          <label className="input-label">DEFINITION</label>
        </div>
      </div>
    </div>
  );

  // ----- Deck Management Functions -----
  const handleDeck = (e) => {
    e.persist();
    setDeck({...deck, [e.target.name]: e.target.value });

  }

  const saveDeck = (e) => {
    e.preventDefault();

    if (!deck.title || !deck.description) {
        alert('Please enter both a title and a description for the set.');
        return;
    }

    // Filter out empty cards
    const filledCards = termDefinitions.filter(card => card.term && card.definition);
    if (filledCards.length === 0) {
        alert('Please add at least one card with a term and a definition.');
        return;
    }

    if (deckId) {
        updateDeck(deckId, navigateBack);
    } else {
        createDeck(filledCards);
    }
  };

  const createDeck = (cards) => {
      const deckData = {
          user_id: userId,
          title: deck.title,
          description: deck.description,
      };

      axios.post("http://localhost/decks", deckData).then((response) => {
          const { data } = response;
          if (data.message === 'Deck created successfully') {
              const createdDeckId = data.deck_id;
              createCards(createdDeckId, cards);
          } else {
              console.error("Unexpected server response:", data);
          }
      }).catch((error) => {
          console.error("Error creating deck:", error);
      });
  };

  const createCards = (deckId, cards) => {
      const cardDataList = cards.map((termDefinition) => ({
          deck_id: deckId,
          question: termDefinition.term,
          answer: termDefinition.definition,
      }));

      Promise.all(cardDataList.map((cardData) => {
          return axios.post("http://localhost/cards", cardData);
      })).then(() => {
          navigate('/library');
      }).catch((error) => {
          console.error("Error creating cards:", error);
      });
  };

  const updateDeck = (deckId, callback) => {
    const deckData = {
        user_id: userId,
        title: deck.title,
        description: deck.description,
    };

    axios.put(`http://localhost/decks/${deckId}`, deckData)
    .then((response) => {
        updateCards(deckId, termDefinitions, callback);
    })
    .catch((error) => {
        console.error("Error updating deck:", error);
    });
  };

  const updateCards = (deckId, cards, callback) => {
  const updateRequests = termDefinitions.map((card, index) => {
    if (card.card_id) {
      const newContent = {
        question: card.term,
        answer: card.definition,
      };
      return axios.put(`http://localhost/cards/${card.card_id}`, newContent);
    }
    return null;
  }).filter(request => request != null); // Filter out null values (for new cards)

  // Create requests for new cards
  const createRequests = termDefinitions
  .filter(card => !card.card_id && card.term && card.definition) // Filter out cards without an ID and with both term and definition
  .map(card => {
    const cardData = {
      deck_id: deckId,
      question: card.term,
      answer: card.definition,
    };
    return axios.post("http://localhost/cards", cardData);
  });

  // Logic to delete removed cards
  if (removedCardIds.length > 0) {
    axios.post("http://localhost/cards/delete", { card_ids: removedCardIds })
      .then(() => {
        // console.log('Removed cards deleted successfully');
      })
      .catch((error) => {
        console.error("Error deleting cards:", error);
      });
  }

  // Combine all requests and execute them
  Promise.all([...updateRequests, ...createRequests])
    .then(() => {
      if (callback) callback();
    })
    .catch((error) => {
      console.error("Error updating/creating cards:", error);
    });
  };

  // ----- Navigation Functions -----
  const navigateBack = () => {
    const deckId = location.state?.deckId;
    if (deckId) {
        navigate(`/decks/${deckId}`);
    } else {
        // Handle the case where there's no deckId (optional)
        navigate('/library'); // Or any other default route
    }
  };

// ----- JSX Rendering -----
  return (
    <div className="create-set">
      <div className="nav-space"></div>
      {
        isEditMode ? 
        (
          <div className="edit-mode-header">
            <h2 className="heading" onClick={navigateBack}>{'< Back to Set'}</h2>
            <button className="delete-button" onClick={() => deleteDeck(deckId)}>Delete</button>
          </div>
        ) : (
          <h2 className="heading">Create a new study set</h2>
        )
      }
      <form onSubmit={saveDeck}>
        <div className="input-title-box">
          <input
            type="text"
            placeholder="Enter a title, like 'Biology - Chapter 22: Evolution'"
            name="title"
            value={deck.title}
            onChange={handleDeck}
          />
        </div>

        <div className="input-description-box">
          <textarea
            placeholder="Add a description..."
            name="description"
            value={deck.description}
            onChange={handleDeck}
          ></textarea>
        </div>

        <div>
          {termDefinitions.map((card, index) => (
            <div key={index} index={index}>
              {renderTermDefinitionCard(card, index)}
            </div>
          ))}
        </div>


        <div className="add-card-box" onClick={addNewCard}>
          <span className="add-card-label">+ ADD CARD</span>
        </div>

        <div className="create-button-container">
        <button className="create-button">{isEditMode ? 'Done' : 'Create'}</button>
        </div>
      </form>
    </div>
  );
}

export default CreateSet;

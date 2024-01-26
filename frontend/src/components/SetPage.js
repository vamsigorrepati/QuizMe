import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import { ScrollItems } from './ScrollItems';
import '../styles/SetPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faPencilAlt} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { faHeart } from '@fortawesome/free-solid-svg-icons';



const SetPage = () => {
   const [setData, setSetData] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const [currentCardIndex, setCurrentCardIndex] = useState(0);
   const [isFlipped, setIsFlipped] = useState(false);
   const [isLiked, setIsLiked] = useState(false);
   const navigate = useNavigate();

   const [editIndex, setEditIndex] = useState(null); // Tracks edit mode
   const [tempCard, setTempCard] = useState({ question: '', answer: '' }); // Temporary state for editing
   const [userId, setUserId] = useState(null)


   const params = useParams();
   // console.log("Deck ID from URL:", params.setId);

   const handleAddOrRemoveTerms = () => {
    navigate('/create-set', { state: { setData, deckId: params.setId, isEditMode: true } });
};

   const handleEdit = (index) => {
       if (editIndex === index) {
           // Save the current edit
           handleSave(index, tempCard.question, tempCard.answer);
           setEditIndex(null); // Exit edit mode
       } else {
           if (editIndex !== null) {
               // Save the previous edit if there was one
               handleSave(editIndex, tempCard.question, tempCard.answer);
           }
           // Start editing the new row
           setTempCard({
               question: setData.cards[index].question,
               answer: setData.cards[index].answer
           });
           setEditIndex(index);
       }
   };

   const updateCard = async (cardId, updatedCard) => {
    try {
        const response = await axios.put(`http://localhost:80/cards/${cardId}`, updatedCard);

        // Handle the successful response
        if (response.status === 200) {
            // console.log('Card updated successfully:', response.data);
            // Additional logic for successful update can go here
        } else {
            // Handle non-successful responses
            console.error('Failed to update card:', response);
        }
    } catch (error) {
        console.error('Error updating card:', error);
    }
};



const handleSave = (index, question, answer) => {
    const updatedCards = setData.cards.map((card, idx) => {
        if (idx === index) {
            const updatedCard = { ...card, question, answer };
            updateCard(card.card_id, updatedCard); // Update in the backend
            return updatedCard;
        }
        return card;
    });
    setSetData({ ...setData, cards: updatedCards });
};



   const handleInputChange = (field, value) => {
       setTempCard({ ...tempCard, [field]: value });
   };


   useEffect(() => {
    if (params.setId) {
        fetchSetData(params.setId);
        checkIfDeckIsFavorited(params.setId);
    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.setId]);

    const checkIfDeckIsFavorited = async (deckId) => {
        try {
            const deck_data = {
              deck_id: deckId,
          }
            const response = await axios.post("http://localhost/isfavorited", deck_data, { withCredentials: true });
            const { data } = response;

            if (data.message === 'Got favorited state') {
                setIsLiked(data.isFavorited)
            }
          } catch (error) {
            console.error('Error fetching favorited state:', error);
          }
    };

    useEffect(() => {
        const checkLoginStatus = async () => {
          try {
            const response = await axios.get("http://localhost/@me", { withCredentials: true });
            const { data } = response;

            if (data.message === 'Logged in' && data.is_confirmed) {

                const deck_data = {
                    deck_id: params.setId,
                }
                axios.post("http://localhost/updaterecents", deck_data, { withCredentials: true })
                setUserId(data.user_id)
            }
          } catch (error) {
            console.error('Error checking user login status:', error);
          }
        };

        checkLoginStatus();
      }, [params.setId]);


   const fetchSetData = async (setId) => {
       setIsLoading(true);
       try {
           const response = await fetch(`http://localhost:80/decks/${setId}`); // Update this URL to your Flask server URL
           if (!response.ok) {
               throw new Error('Network response was not ok');
           }
           const data = await response.json();
           // console.log("Fetched data:", data);  // Log the fetched data
           setSetData(data);
           // console.log("Set Data after fetch:", data);


       } catch (error) {
           console.error('Fetch error:', error);
       }
       setIsLoading(false);
   };


   const handleCardFlip = () => {
       setIsFlipped(!isFlipped);
   };


   const handleNextCard = () => {
       if (currentCardIndex < setData.cards.length - 1) {
           setCurrentCardIndex(currentCardIndex + 1);
       }
   };

   const handlePreviousCard = () => {
       if (currentCardIndex > 0) {
           setCurrentCardIndex(currentCardIndex - 1);
       }
   };

   const renderFlashcards = () => {
       if (!setData || !setData.cards || setData.cards.length === 0) return null;
       const currentCard = setData.cards[currentCardIndex];
       return (
           <div className="study-mode-container">
               <div className={`card-setpage ${isFlipped ? 'flipped' : ''}`} onClick={handleCardFlip}>
                   <div className="card-front">
                       <p>{currentCard.question}</p>
                   </div>
                   <div className="card-back">
                       <p>{currentCard.answer}</p>
                   </div>
               </div>

               <div className="navigation-container">
                   <button className="arrow-button" style={{color: currentCardIndex === 0 ? "#999999" : "#ffffff"}} onClick={handlePreviousCard} disabled={currentCardIndex === 0}>
                       <FontAwesomeIcon icon={faArrowLeft} size="xl" />
                   </button>
                   <span className="card-counter">{currentCardIndex + 1}/{setData.cards.length}</span>
                   <button className="arrow-button" style={{color: currentCardIndex === setData.cards.length - 1 ? "#999999" : "#ffffff"}} onClick={handleNextCard} disabled={currentCardIndex === setData.cards.length - 1}>
                       <FontAwesomeIcon icon={faArrowRight} size="xl" />
                   </button>
               </div>


           </div>
       );
   };
   const handleLike = async () => {
    setIsLiked(!isLiked); // Toggle like state

    try {
        const response = await fetch('http://localhost:80/favoritedecks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId, // Replace with actual logged-in user's ID
                //TODO must change
                deck_id: params.setId, // Deck ID from URL parameters
            }),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error updating favorite deck:', error);
    }
};


const handleCreatorClick = (userId) => {
    navigate(`/profile`, { state: { userId: userId } });
};


   const renderSetContent = () => {
       // console.log("Set Data in render:", setData);
       if (!setData || !setData.cards) return <p style={{padding: "20px"}}>No set data found.</p>;
        // console.log("test", setData)
       return (
           <>
           <div className="nav-space"></div>
           <div className="set-info-container">
                <h2 className="set-info-title">{setData.title}</h2>
                <div className="set-info-details">
                <p>Created by: <span
                                    onClick={() => handleCreatorClick(setData.user_id)} 
                                    style={{ cursor: 'pointer', 
                                    textDecoration: 'underline' }}>{setData.user}
                                </span>
                </p>
                {userId && (
                    <FontAwesomeIcon
                        icon={faHeart}
                        className={`heart-icon ${isLiked ? 'liked' : ''}`}
                        onClick={handleLike}
                    />
                )}
                </div>
            </div>

               {renderFlashcards()}
               <h3 className="terms-in-set">
                   Terms in this set ({setData.cards.length})
               </h3>

           {setData.cards.map((card, index) => (
               <div key={index} className="term-definition-card">
                   <div className="term-definition-pair">
                       {editIndex === index ? (
                           <>
                               <textarea
                                   type="text"
                                   value={tempCard.question}
                                   className="term-input-setpage"
                                   onChange={(e) => handleInputChange('question', e.target.value)}
                               />
                               <textarea
                                   type="text"
                                   value={tempCard.answer}
                                   className="definition-input-setpage"
                                   onChange={(e) => handleInputChange('answer', e.target.value)}
                               />
                           </>
                       ) : (
                           <>
                               <span className="term-title">{card.question}</span>
                               <span className="term-description">{card.answer}</span>
                           </>
                       )}
                        {userId === setData.user_id && (
                            <div className="icons-inline">
                                <FontAwesomeIcon
                                    icon={faPencilAlt}
                                    className={`pencil-icon ${editIndex === index ? 'edit-mode' : ''}`}
                                    onClick={() => handleEdit(index)}
                                />
                            </div>
                        )}

                   </div>
               </div>
           ))}

        {userId === setData.user_id && (
            <div className="add-remove-container">
                <button className="add-remove-button" onClick={handleAddOrRemoveTerms}>Add or Remove Terms</button>
            </div>
        )}

           </>
       );
   };


   return (
       <div className="set-page-container">
           {isLoading ? <p style={{padding: "20px"}}>Loading...</p> : renderSetContent()}
       </div>
   );
};


export default SetPage;




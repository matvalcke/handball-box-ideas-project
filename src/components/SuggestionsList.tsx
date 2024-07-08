// SuggestionsList.js
import React, { useEffect, useState } from 'react';
import './SuggestionsList.css';

const SuggestionsList = () => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/suggestions')
        .then(response => response.json())
        .then(data => setSuggestions(data));
  }, []);

  const handleLike = async (id) => {
    await fetch(`http://localhost:5000/suggestions/${id}/like`, {
      method: 'POST'
    });
    const updatedSuggestions = suggestions.map(suggestion =>
        suggestion._id === id ? { ...suggestion, likes: (suggestion.likes || 0) + 1 } : suggestion
    );
    setSuggestions(updatedSuggestions);
  };

  const handleDislike = async (id) => {
    await fetch(`http://localhost:5000/suggestions/${id}/dislike`, {
      method: 'POST'
    });
    const updatedSuggestions = suggestions.map(suggestion =>
        suggestion._id === id ? { ...suggestion, dislikes: (suggestion.dislikes || 0) + 1 } : suggestion
    );
    setSuggestions(updatedSuggestions);
  };

  return (
      <div className="suggestions-list">
        <h2>Suggestions</h2>
        <ul>
          {suggestions.map(suggestion => (
              <li key={suggestion._id}>
                <h3>{suggestion.title}</h3>
                <p>{suggestion.description}</p>
                <p><strong>Author:</strong> {suggestion.author}</p>
                <p>Likes: {suggestion.likes || 0}</p>
                <p>Dislikes: {suggestion.dislikes || 0}</p>
                <div className="buttons">
                  <button className="like" onClick={() => handleLike(suggestion._id)}>Like</button>
                  <button className="dislike" onClick={() => handleDislike(suggestion._id)}>Dislike</button>
                </div>
              </li>
          ))}
        </ul>
      </div>
  );
};

export default SuggestionsList;

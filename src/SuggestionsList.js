import React, { useEffect, useState } from 'react';

const SuggestionsList = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/suggestions')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setSuggestions(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    const handleVote = (id, vote) => {
        fetch(`http://localhost:5000/suggestions/${id}/vote`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ vote }),
        })
            .then(response => response.json())
            .then(updatedSuggestion => {
                setSuggestions(prevSuggestions =>
                    prevSuggestions.map(suggestion =>
                        suggestion._id === updatedSuggestion._id ? updatedSuggestion : suggestion
                    )
                );
            })
            .catch(error => {
                console.error('Error voting:', error);
                setError(error);
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h2>Suggestions</h2>
            <ul>
                {suggestions.map(suggestion => (
                    <li key={suggestion._id}>
                        <h3>{suggestion.title}</h3>
                        <p>{suggestion.description}</p>
                        <p>By: {suggestion.author}</p>
                        <p>Votes: {suggestion.votes}</p>
                        <button onClick={() => handleVote(suggestion._id, 1)}>Upvote</button>
                        <button onClick={() => handleVote(suggestion._id, -1)}>Downvote</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SuggestionsList;

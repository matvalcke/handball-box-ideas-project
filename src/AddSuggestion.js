import React, { useState } from 'react';

const AddSuggestion = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newSuggestion = { title, description, author };

    const response = await fetch('http://localhost:5000/suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newSuggestion),
    });

    if (response.ok) {
      setTitle('');
      setDescription('');
      setAuthor('');
      alert('Suggestion added successfully!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add a Suggestion</h2>
      <label>
        Title:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label>
        Description:
        <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
      </label>
      <label>
        Author:
        <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
      </label>
      <button type="submit">Add Suggestion</button>
    </form>
  );
};

export default AddSuggestion;



import React, { useState } from 'react';

const AddSuggestion = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const suggestion = { title, description, author };

        try {
            const response = await fetch('http://localhost:5000/suggestions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(suggestion)
            });

            if (!response.ok) {
                throw new Error('Failed to submit suggestion');
            }

            setTitle('');
            setDescription('');
            setAuthor('');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                required
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                required
            />
            <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author"
                required
            />
            <button type="submit">Add Suggestion</button>
        </form>
    );
};
/*
const enableNotification = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            const registration = await navigator.serviceWorker.ready;
            let sub = await registration.pushManager.getSubscription();

            if (!sub) {
                const response = await fetch('/push/key');
                const keys = await response.json();
                const applicationServerKey = urlBase64ToUint8Array(keys.pubkey);
                sub = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: applicationServerKey
                });

                await fetch('http://localhost:5000/subscribe', {
                    method: 'POST',
                    body: JSON.stringify(sub),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log('User is subscribed:', sub);
            }
        } else {
            console.error('Permission not granted for Notification');
        }
    } catch (error) {
        console.error('Failed to enable notification:', error);
    }
};

useEffect(() => {
    enableNotification();
}, []);

const handleSubmit = async (e) => {
    e.preventDefault();
    const suggestion = { title, description };

    await fetch('http://localhost:5000/suggestions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(suggestion)
    });

    await fetch('http://localhost:5000/notifyNewIdea', {
        method: 'POST'
    });

    setTitle('');
    setDescription('');
};
*/
export default AddSuggestion;

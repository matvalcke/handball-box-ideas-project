import React, { useEffect } from 'react';
import './App.css';
import SuggestionsList from './components/SuggestionsList.tsx';
import AddSuggestion from './components/AddSuggestion.tsx';

const App = () => {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);

                    navigator.serviceWorker.addEventListener('message', (event) => {
                        console.log('Received message from service worker:', event.data);
                    });
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        }
    }, []);

    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

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

    return (
        <div>
            <header>
                <h1 className="app-title">Handball Ideas Box</h1>
            </header>
            <main>
                <AddSuggestion />
                <SuggestionsList />
            </main>
        </div>
    );
};

export default App;

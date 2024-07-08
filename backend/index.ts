import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { json } from 'body-parser';
import { Suggestion } from './models/Suggestion.ts';
import webpush from 'web-push';  // Assurez-vous que le chemin est correct

const app = express();
const PORT = 5000;

mongoose.connect('mongodb://localhost:27017/handball-ideas', {});

app.use(cors());
app.use(json());

app.get('/suggestions', async (req, res) => {
  const suggestions = await Suggestion.find();
  res.json(suggestions);
});

let subscriptions :any[] = [];

app.post('/suggestions', async (req, res) => {
  const { title, description, author } = req.body;

  if (!title || !description || !author) {
    return res.status(400).send('All fields (title, description, author) are required');
  }

  try {
    const newSuggestion = new Suggestion({ title, description, author });
    await newSuggestion.save();

    // Send notifications
    const payload = JSON.stringify({ title: 'Nouvelle suggestion', body: `Une nouvelle suggestion a été ajoutée: ${title}` });
    subscriptions.forEach(subscription => {
      webpush.sendNotification(subscription, payload).catch(error => console.error('Error sending notification:', error));
    });

    res.status(201).send(newSuggestion);
  } catch (error) {
    res.status(500).send('Error creating suggestion: ' + error.message);
  }
});


app.post('/suggestions/:id/like', async (req, res) => {
  try {
    const suggestion = await Suggestion.findById(req.params.id);
    if (!suggestion) return res.status(404).json({ message: 'Suggestion not found' });

    suggestion.likes = (suggestion.likes || 0) + 1;
    await suggestion.save();
    res.json(suggestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour disliker une suggestion
app.post('/suggestions/:id/dislike', async (req, res) => {
  try {
    const suggestion = await Suggestion.findById(req.params.id);
    if (!suggestion) return res.status(404).json({ message: 'Suggestion not found' });

    suggestion.dislikes = (suggestion.dislikes || 0) + 1;
    await suggestion.save();
    res.json(suggestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/push/key', (req, res) => {
  return res.json({
    pubkey: process.env.VAPID_PUBLIC_KEY
  });
});

app.post('/push/sub', (req, res) => {
  subscriptions.push(req.body);
  return res.json({});
});

app.post('/subscribe', (req, res) => {
  console.log("toto");
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({});
});

app.post('/notifyNewIdea', async (req, res) => {
  const payload = JSON.stringify({
    title: 'Nouvelle Idée',
    body: 'Une nouvelle idée a été publiée dans Handball Ideas Box !',
    icon: 'path_to_your_icon.png',
    data: { url: 'http://localhost:3000/suggestions' }  // URL à ouvrir lors du clic sur la notification
  });

  try {
    //const subscriptions = await Subscription.find();
    await Promise.all(subscriptions.map(sub => {
      return webpush.sendNotification(sub, payload);
    }));
    res.status(200).send('Notifications envoyées avec succès.');
  } catch (error) {
    console.error('Erreur lors de l\'envoi de notifications :', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi de notifications.' });
  }
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

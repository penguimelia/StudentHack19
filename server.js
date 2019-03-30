const express = require('express');
const fetch = require('node-fetch');
const querystring = require('querystring');
const artistSearchUrl = 'https://api.musixmatch.com/ws/1.1/artist.search?';
const songsSearchUrl = 'https://api.musixmatch.com/ws/1.1/track.search?';
const app = express();
const port = process.env.PORT || 5000;
const apiKey = process.env.API_KEY || 'cb36077f3b2b273d83aba78dfaabc8e1';

app.get('/api/searchArtist/', (req, res) => {
  const data = req.query;
  let url = artistSearchUrl;
  for (const key in data) url += (key + '=' + data[key] + '&');
  url += 'apikey=' + apiKey;

  fetch(url)
    .then(response => {
      response.json().then(json => {
        res.send({ artists:  json.message.body.artist_list });
      })
    })
    .catch(error => {
      console.log(error);
    });
});

app.get('/api/topSongs/', (req, res) => {
  const data = req.query;
  let url = songsSearchUrl;
  for (const key in data) url += (key + '=' + data[key] + '&');
  url += 'apikey=' + apiKey;

  fetch(url)
    .then(response => {
      response.json().then(json => {
        res.send({ songs:  json.message.body.track_list });
      })
    })
    .catch(error => {
      console.log(error);
      res.send({});
    });
});

app.post('/api/world', (req, res) => {
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

app.listen(port, () => console.log(`Listening on port ${port}`));

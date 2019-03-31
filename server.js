const express = require('express');
const fetch = require('node-fetch');
const request = require('request');
const sw = require('stopword');
const querystring = require('querystring');
const simplegetlyrics = require('simple-get-lyrics');
const fs = require('fs');
const path = require('path');
const textcleaner = require('text-cleaner');
const { SentimentAnalyzer } = require('node-nlp');
const artistSearchUrl = 'https://api.musixmatch.com/ws/1.1/artist.search?';
const songsSearchUrl = 'https://api.musixmatch.com/ws/1.1/track.search?';
const app = express();
const port = process.env.PORT || 5000;
const apiKey = process.env.API_KEY || '27039d2c62c1185c4c220751b15ea31d';

const writeToCache = (data, lyrics, songs) => {
  const cache = JSON.parse(fs.readFileSync('cache.txt', 'utf8'));
  const entry = {
    'songs': songs,
    'lyrics': lyrics
  };

  cache[data.f_artist_id] = entry;

  fs.writeFile('cache.txt', JSON.stringify(cache), 'utf8', (err) => {
    if (err) throw err;
  });
}

const sanitizeString = (str) => {

  if (!str) {
    str = '';
  };
  //remove accents
  str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  //remove new line symbols
  str = str.replace(/\n/g, ' ');
  //To lower case
  str = str.toLowerCase(str);
  //Remove non alphabetical chars
  str = str.replace(/[^a-zA-Z]/g, ' ');
  //remove single letter words
  str = str.replace(/\b[a-zA-z]{1,2}\b/g,' ');
  //remove multiple spaces
  str = str.replace(/ {1,}/g,' ');
  //remove stopwords
  str = sw.removeStopwords(str.split(' '));

  const newString = sw.removeStopwords(str, ['doo', 'don', 'just', 'dont', 'aint', 'ive', 'its', '', 'ain']);

  return newString;
}

const getPastData = (cache) => {
	const data = [];
	Object.keys(cache).forEach(key => {
		const artist = {
			id: cache[key].songs[0].track.artist_id,
			name: cache[key].songs[0].track.artist_name,
			lyrics: [],
		};

		Object.keys(cache[key].lyrics).forEach(lyricKey => {
			artist.lyrics = artist.lyrics.concat(cache[key].lyrics[lyricKey]);
		});

		data.push(artist);
	});

	return data;
}

const updatePastData = (pastData, lyrics, songs, artistId) => {
	const newEntry = {
		id: artistId,
		name: songs[0].track.artist_name,
		lyrics: []
	};

	Object.keys(lyrics).forEach(lyricKey => {
		newEntry.lyrics = newEntry.lyrics.concat(lyrics[lyricKey]);
	});

	pastData.push(newEntry);
}

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
  const cache = JSON.parse(fs.readFileSync('cache.txt', 'utf8'));
	const pastData = getPastData(cache);

  if (cache[data.f_artist_id]) {
    res.send({
      songs:  cache[data.f_artist_id].songs,
      lyrics: cache[data.f_artist_id].lyrics,
			pastData: pastData,
    });
    return;
  }

	let songsThatFailedToLoad = 0;
  const lyrics = {};
  let url = songsSearchUrl;
  for (const key in data) url += (key + '=' + data[key] + '&');
  url += 'apikey=' + apiKey;

  fetch(url)
    .then(response => {
      response.json().then(json => {
        const songs = json.message.body.track_list;

        const promises = songs.map(song =>
					simplegetlyrics.search(song.track.artist_name, song.track.track_name)
					.catch(err => {
						console.log(url);
						songsThatFailedToLoad++;
						return '';
					})
				);

        Promise.all(promises)
          .then(results => {
						const sentiment = new SentimentAnalyzer({ language: 'en' });
            songs.forEach((song, index) => {
              lyrics[song.track.track_id] = sanitizeString(results[index].lyrics);
            });

						const sentimentPromises = songs.map(song => sentiment.getSentiment(lyrics[song.track.track_id].join(' ')));

						Promise.all(sentimentPromises)
							.then(resultingSentiments => {
								resultingSentiments.forEach((sent, idx) => songs[idx].sentiment = sent);
								writeToCache(data, lyrics, songs);
								updatePastData(pastData, lyrics, songs, data.f_artist_id);

								res.send({
		              songs:  songs,
		              lyrics: lyrics,
									pastData: pastData,
									songsThatFailedToLoad: songsThatFailedToLoad
		            });
							})
          })
          .catch(error => {
            console.log(error);
          })
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

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));

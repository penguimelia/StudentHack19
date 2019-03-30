const express = require('express');
const fetch = require('node-fetch');
const request = require('request');
const cheerio = require('cheerio');
const sw = require('stopword');
const querystring = require('querystring');
const simplegetlyrics = require('simple-get-lyrics');
const fs = require('fs');
const textcleaner = require('text-cleaner');
const artistSearchUrl = 'https://api.musixmatch.com/ws/1.1/artist.search?';
const songsSearchUrl = 'https://api.musixmatch.com/ws/1.1/track.search?';
const app = express();
const port = process.env.PORT || 5000;
const apiKey = process.env.API_KEY || '52b9f0ea425b6af5aa36aecc45965535';

const transformToFriendly = (data) => {
	data = data.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
	data = data.replace(/\W/g,"");
	data = data.toLowerCase();
	return data;
}

const lyricsUrl = (artistName, songName) => {
	var returnUrl = 'https://azlyrics.com/';
	artistName = transformToFriendly(artistName);
	songName = transformToFriendly(songName);
	returnUrl += "lyrics/" + artistName + "/" + songName + ".html";
	return returnUrl;
}

const getLyrics = (artistName, songName) => {
  const url = lyricsUrl(artistName, songName);
	return new Promise(r => {
		var Response = request(url, (error, response, body) => {
			var $ = cheerio.load(body);
			var lyrics = '';
			try {
				if ($(".col-xs-12.col-lg-8.text-center")[0].children[16]) {
					var lyricsDiv = $(".col-xs-12.col-lg-8.text-center")[0].children[16].children;
					if (lyricsDiv && lyricsDiv.length > 0) {
						var lyrics = lyricsDiv[2].data.substr(1)+"\n";
						for(var index = 4; index < lyricsDiv.length; index+=2)
						{
							if (lyricsDiv[index].data) {
								var line = lyricsDiv[index].data.substr(1)+"\n";
								lyrics += line;
							}
						}
					}
					lyrics = lyrics.slice(0,-2);
				}
			} catch (error) {
				console.log(url);
			}
			r(lyrics);
		});
	});
}

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
	// Remove accents
	str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

	// Remove extra spaces and apostrophes
	str = textcleaner(str).condense().removeApostrophes().valueOf();

	// To lower case
  str = str.toLowerCase(str);

	// Remove weird chars
	str = textcleaner(str).removeChars().valueOf();

  str = str.replace(/^\w{1}$/g, '');
  str = str.replace(/\b[a-zA-z]{1,2}\b/g,' ');
  str = str.replace(/ {1,}/g,' ');

	// Remove stopwords
  str = sw.removeStopwords(str.split(' '));

  return str;
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

  if (cache[data.f_artist_id]) {
    res.send({
      songs:  cache[data.f_artist_id].songs,
      lyrics: cache[data.f_artist_id].lyrics
    });
    return;
  }


  const lyrics = {};
  let url = songsSearchUrl;
  for (const key in data) url += (key + '=' + data[key] + '&');
  url += 'apikey=' + apiKey;

  fetch(url)
    .then(response => {
      response.json().then(json => {
        const songs = json.message.body.track_list;

        const promises = songs.map(song => simplegetlyrics.search(song.track.artist_name, song.track.track_name));

        Promise.all(promises)
          .then(results => {
            songs.forEach((song, index) =>
              lyrics[song.track.track_id] = sanitizeString(results[index].lyrics)
            );
            writeToCache(data, lyrics, songs);
            res.send({
              songs:  songs,
              lyrics: lyrics
            });
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

app.listen(port, () => console.log(`Listening on port ${port}`));

import React, { Component } from 'react';
import querystring from 'querystring';
import ReactLoading from 'react-loading';
import ChartComponent from '../ChartComponent/ChartComponent.js';
import './ArtistComponent.css';
// import './ArtistComponent.css';
import ReactWordcloud from 'react-wordcloud';

const baseUrl = '/api/topSongs?';

const words = [
  { text: "hello", value: 3 },
  { text: "world", value: 12.5 },
  { text: "github", value: 1 },
  { text: "code", value: 1 }
];

const getLyricsFreq = lyrics => {
  const freq = {};

  Object.values(lyrics).forEach((lyric) => {
    lyric.forEach((word) => {
      if (freq[word] > 0) {
        freq[word]++;
      } else {
        freq[word] = 1;
      }
    });
  });

  const sorted = Object.keys(freq)
    .map(word => [word, freq[word]])
    .sort((first, second) => second[1] - first[1])

  return sorted;
}

class ArtistComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      songs: [],
      lyrics: {}
    };
  }

  getMostPopularSongs = async (artist) => {

  };

  updateComponent() {
    const data = {
      f_artist_id: this.props.artist.artist_id,
      page_size: 20,
      page: 1,
      s_track_rating: 'desc',
      f_has_lyrics: 1,
    };
    const url = baseUrl + querystring.stringify(data);

    fetch(url)
      .then(response => {
        response.json().then(json => {
          this.setState({
            songs: json.songs,
            lyrics: json.lyrics,
          });
        })
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentDidMount() {
    this.updateComponent();
  }

  componentDidUpdate(prevProps) {
    if (this.props.artist.artist_id === prevProps.artist.artist_id)
      return;
    this.updateComponent();
  }

  render() {
    const { artist } = this.props;
    const { songs, lyrics } = this.state;

    if (!songs || !songs.length || !lyrics || !Object.keys(lyrics).length)
      return (<ReactLoading />);

    const lyricsFreq = getLyricsFreq(lyrics);
    const numberOfWords = lyricsFreq.reduce((total, pair) => pair[1] + total, 0);
    const numberOfUniqueWords = Object.keys(lyricsFreq).length;

    return (
      <div>
        <h2 className='artistName'>{artist.artist_name}</h2>
        <p>{'Number of words: ' + numberOfWords + ' | Number of unique words: ' + numberOfUniqueWords}</p>
        {songs.map(({ track }, index) => (
          <div key={track.track_id}>
            <p className='songAlbum'>{track.track_name} | {track.album_name}</p><br/>
          </div>
        ))}

        {<ChartComponent freq={lyricsFreq} artist={artist}/>}
      </div>
    )
  }
}

export default ArtistComponent;

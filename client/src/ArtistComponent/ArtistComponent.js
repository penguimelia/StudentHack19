import React, { Component } from 'react';
import querystring from 'querystring';
import ReactLoading from 'react-loading';
import ChartComponent from '../ChartComponent/ChartComponent.js';
import PastDataComponent from '../PastDataComponent/PastDataComponent.js';
import SentimentsComponent from '../SentimentsComponent/SentimentsComponent.js';
import './ArtistComponent.css';
// import './ArtistComponent.css';

const baseUrl = '/api/topSongs?';

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
      lyrics: {},
      pastData: [],
    };
  }

  getMostPopularSongs = async (artist) => {

  };

  updateComponent() {
    const data = {
      f_artist_id: this.props.artist.artist_id,
      page_size: 50,
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
            pastData: json.pastData,
            songsThatFailedToLoad: json.songsThatFailedToLoad,
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
    const { songs, lyrics, pastData, songsThatFailedToLoad } = this.state;

    if (!songs || !songs.length || !lyrics || !Object.keys(lyrics).length
        || songs[0].track.artist_id !== artist.artist_id)
      return (<ReactLoading />);

    const storageData = JSON.parse(localStorage.getItem('artistsIds') || '[]');
    if (!storageData.includes(artist.artist_id)) {
      storageData.push(artist.artist_id);
      localStorage.setItem('artistsIds', JSON.stringify(storageData));
    }

    const lyricsFreq = getLyricsFreq(lyrics);
    const numberOfWords = lyricsFreq.reduce((total, pair) => pair[1] + total, 0);
    const numberOfUniqueWords = Object.keys(lyricsFreq).length;

    return (
      <div className='artistComponent'>
        <h2 className='artistName'>{artist.artist_name}</h2>
        {songsThatFailedToLoad ? <p>{'Succesfully loaded songs: ' + (50 - songsThatFailedToLoad)}</p> : null}
        <p>{'Number of words: ' + numberOfWords + ' | Number of unique words: ' + numberOfUniqueWords}</p>
        <div className='songsInfo'>
          {songs.map(({ track }, index) => (
            <div key={track.track_id}>
              <p className='songAlbum'>{track.track_name} | {track.album_name}</p><br/>
            </div>
          ))}
        </div>

        {<ChartComponent freq={lyricsFreq} artist={artist}/>}
        <br />
        {<SentimentsComponent data={songs} />}
        <br />
        {pastData ? <PastDataComponent data={pastData} storageData={storageData} /> : null}
      </div>
    )
  }
}

export default ArtistComponent;

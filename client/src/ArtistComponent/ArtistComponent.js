import React, { Component } from 'react';
import querystring from 'querystring';
// import './ArtistComponent.css';

const baseUrl = '/api/topSongs?';

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
      page_size: 5,
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

    return (
      <div>
        {artist.artist_name}
        {songs && songs.length && songs.map(({ track }, index) => (
          <div key={track.track_id}>
            <p>{track.track_name} | {track.album_name}</p><br/>
          </div>
        ))}
      </div>
    )
  }
}

export default ArtistComponent;

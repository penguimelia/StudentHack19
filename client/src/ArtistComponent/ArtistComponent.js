import React, { Component } from 'react';
import querystring from 'querystring';
// import './ArtistComponent.css';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

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

  lyricFreq = () => {
    var freqChart = [];

    Object.values(this.state.lyrics).forEach((song) => {
      song.forEach((key) => {
        if (freqChart.hasOwnProperty(key)) {
          freqChart[key]++;
        } else {
          freqChart[key] = 1;
        }
      });
    })

    var sorted = Object.keys(freqChart).map(function(key) {
        return [key, freqChart[key]];
      }).sort(function(first, second) {
        return second[1] - first[1];
      });

    return sorted;
  }

  createFreqChart = () => {
    var freqChart = this.lyricFreq();

    var chart = {
      chart: {
        type: 'bar',
        width: 800,
        height: 1000
      },
      title: {
        text: 'Words ' + this.props.artist.artist_name + ' uses'
      },
      xAxis: {
        categories: freqChart.map(pair => pair[0])
      },
      series: [{
        name: this.props.artist.artist_name,
        data: freqChart.map(pair => pair[1])
      }]
    };

    return <HighchartsReact
      highcharts={Highcharts}
      options={chart}
    />;
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

        {Object.keys(lyrics).length > 0 ? this.createFreqChart() : null}
      </div>
    )
  }
}

export default ArtistComponent;

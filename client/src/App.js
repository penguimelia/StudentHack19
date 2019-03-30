import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import SearchComponent from './SearchComponent/SearchComponent';
import ArtistComponent from './ArtistComponent/ArtistComponent';

class App extends Component {
  constructor() {
    super();

    this.state = {
      artist: '',
    };
  }

  onSuggestionSelected = ({ artist }) => {
    this.setState({
      artist: artist,
    });
  }

  render() {
    const { artist } = this.state;

    return (
      <div className="App">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Lyrics Analyser</h1>
        <SearchComponent onSuggestionSelected={this.onSuggestionSelected} />
        {artist && (
          <ArtistComponent artist={artist}/>
        )}
      </div>
    );
  }
}

export default App;

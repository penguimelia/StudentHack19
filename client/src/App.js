import React, { Component } from 'react';
import logo from './logo.svg';
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
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <SearchComponent onSuggestionSelected={this.onSuggestionSelected} />
          {artist && (
            <ArtistComponent artist={artist}/>
          )}
        </header>
      </div>
    );
  }
}

export default App;

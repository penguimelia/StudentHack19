import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import querystring from 'querystring';
import './SearchComponent.css';

const baseUrl = '/api/searchArtist?';

const getSuggestionValue = suggestion => suggestion.artist.artist_name;

const renderSuggestion = suggestion => (
  <div>
    {suggestion.artist.artist_name}
  </div>
);

class SearchComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      suggestions: []
    };
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionSelected = (event, { suggestion }) => {
    this.props.onSuggestionSelected(suggestion);
  }

  onSuggestionsFetchRequested = async ({ value }) => {
    const data = {
      q_artist: value,
      page_size: 5,
    };
    const url = baseUrl + querystring.stringify(data);

    const response = await fetch(url);
    const body = await response.json();

    this.setState({
      suggestions: body.artists,
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;

    const inputProps = {
      placeholder: 'Type an artist',
      value,
      onChange: this.onChange
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        onSuggestionSelected={this.onSuggestionSelected}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}

export default SearchComponent;

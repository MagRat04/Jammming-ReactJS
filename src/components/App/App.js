import React, { Component } from 'react';
import './App.css';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import SearchBar from '../SearchBar/SearchBar';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName: 'Good Ole Metal',
      playlistTracks: []
      }

        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.search = this.search.bind(this);
    };

  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === this.state.playlistTracks.id)) {
      return;
    } else {
      this.state.playlistTracks.push(track);
      this.setState({playlistTracks: track});
    }
  }

  removeTrack(track) {
    this.state.playlistTracks.splice(track.id);
    this.setState(this.state.playlistTracks);
  }

  updatePlaylistName(name) {
    this.setState({name: name});
  }

  savePlaylist() {
    this.state.playlistTracks.map(track => track.uri)
  }

  search(term) {
    Spotify.search(term).then(tracks => {
      this.setState({ searchResults: tracks });
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar
            onSearch={this.search}
          />
          <div className="App-playlist">
              <SearchResults 
                searchRes={this.state.SearchResults}
                onAdd={this.addTrack}
              />
              <Playlist 
                playlistName={this.state.playlistName}
                playlistTracks={this.state.playlistTracks}
                onRemove={this.state.removeTrack}
                onNameChange={this.updatePlaylistName}
                onSave={this.savePlaylist}
              />
          </div>
        </div>
      </div>
    );
  }
}

export default App;

const clientID = '28adf6a9ddc44165bef6d067ef9ec4dc';
const redirectURI = 'http://localhost:3000/';

let accessToken;
let expiresIn;

const Spotify = {
    getAccessToken() {
        const url = window.location.href;
        const token = url.match(/access_token=([^&]*)/);
        const time = url.match(/expires_in=([^&]*)/);
        if (accessToken) {
            return accessToken;
        } else if (token && time) {
            accessToken = token[1];
            expiresIn = time[1]; 
            window.setTimeout(() => accessToken = null, expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
      return accessToken;
        } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=token`;
        }
    },
    search(term) {
        this.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&limit=20&q=${term}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        }).then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error('Request Failed!');
        }, networkError => console.log(networkError.message)
        ).then(jsonResponse => {
            if (jsonResponse.tracks) {
                return jsonResponse.tracks.items.map(track => ({
                    id: track.id,
                    title: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                }))
            } else {
                return [];
            }
        })
    },
    savePlaylist(playlistName, trackURIs) {
        this.getAccessToken();
        let userID;
        let playlistID;

        if (playlistName && trackURIs) {
            return fetch(`https://api.spotify.com/v1/me`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            }).then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Request Failed!');
            }, networkError => console.log(networkError.message)
            ).then(jsonResponse => {
            userID = jsonResponse.id;
            return; // might need to set the variable on the return line?
            }).then(() => {
                return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                    headers: {Authorization: `Bearer ${accessToken}` },
                    method: 'POST',
                    body: JSON.stringify({name: playlistName})
            }).then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Request Failed!');
            }, networkError => console.log(networkError.message)
            ).then(jsonResponse => {
                return playlistID = jsonResponse.id
            })
            }).then(() => {
                    return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                        method: 'POST',
                        body: JSON.stringify({ uris: trackURIs })
                    }).then(response => {
                        if (response.ok) {
                            return response.json();
                        }
                        throw new Error('Request Failed!');
                    }, networkError => console.log(networkError.message)
                    ).then(jsonResponse => {
                    });
                });
        } else {
            return;
        }
    }
}
export default Spotify; 
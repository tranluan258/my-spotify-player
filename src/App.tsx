import { useEffect, useState } from "react";
import axios from "axios";
import SpotifyPlayer from "react-spotify-web-playback";
import * as React from "react";
import { IPlaylist, Playlist } from "./components/Playlist";
import { ITrack, Track } from "./components/Track";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const AUTH_ENDPOINT = import.meta.env.VITE_AUTH_ENDPOINT;
const RESPONSE_TYPE = "token";
const SCOPES = import.meta.env.VITE_SCOPES;

interface IState {
  isPlaying: boolean;
  track: {
    id: string;
  };
}

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [playlist, setPlaylist] = useState<IPlaylist[] | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<string | null>(null);
  const [tracks, setTracks] = useState<ITrack[] | null>(null);
  const [play, setPlay] = useState<boolean>(true);
  const [trackActive, setTrackActive] = useState<string | null>(null);

  useEffect(() => {
    const _token = localStorage.getItem("token");
    if (_token) {
      setToken(_token);
    }
  }, []);

  useEffect(() => {
    const hash = window.location.hash
      .substring(1)
      .split("&")
      .reduce<{ [key: string]: string }>((initial, item) => {
        if (item) {
          const parts = item.split("=");
          initial[parts[0]] = decodeURIComponent(parts[1]);
        }

        return initial;
      }, {});

    window.location.hash = "";

    const _token = hash.access_token;

    if (_token) {
      setToken(_token);
      localStorage.setItem("token", _token);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    axios
      .get("https://api.spotify.com/v1/me/playlists", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setPlaylist(res.data.items);
        const currentPlaylist = localStorage.getItem("currentPlaylist");
        if (currentPlaylist) {
          setCurrentPlaylist(currentPlaylist);
        } else {
          setCurrentPlaylist(res.data.items[0].id);
          localStorage.setItem("currentPlaylist", res.data.items[0].id);
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        setToken(null);
        window.location.reload();
      });
  }, [token]);

  useEffect(() => {
    axios
      .get(
        "https://api.spotify.com/v1/playlists/" + currentPlaylist + "/tracks",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      )
      .then((res) => {
        setTracks(res.data.items);
        setTrackActive(res.data.items[0].track.id);
      });
  }, [currentPlaylist, token]);

  const selectPlaylist = (e: React.MouseEvent<HTMLDivElement>) => {
    const id: string = e.currentTarget.id;
    setCurrentPlaylist(id);
    setPlay(true);
    localStorage.setItem("currentPlaylist", id);
  };

  return (
    <div className="App">
      {!token ? (
        <div className="flex justify-center h-[100vh]">
          <button>
            <a
              href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`}
              className="py-2 px-4 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none btn btn--login focus:shadow-outline"
            >
              Login to Spotify
            </a>
          </button>
        </div>
      ) : (
        <div>
          <div className="flex flex-row justify-center items-center w-full h-[100px]">
            {playlist &&
              playlist!.map((playlist: IPlaylist) => (
                <Playlist item={playlist} selectPlaylist={selectPlaylist} />
              ))}
          </div>
          <div className="mt-6 flex  justify-center items-center ">
            <div className="w-1/2">
              {currentPlaylist && (
                <SpotifyPlayer
                  token={token}
                  uris={["spotify:playlist:" + currentPlaylist]}
                  play={play}
                  callback={(state: IState) => {
                    if (state.track) setTrackActive(state.track.id);
                    if (!state.isPlaying && state.track?.id.length > 0)
                      setPlay(false);
                    if (state.isPlaying) setPlay(true);
                  }}
                  styles={{
                    bgColor: "#333",
                    color: "#fff",
                    loaderColor: "#fff",
                    sliderColor: "#1cb954",
                    savedColor: "#fff",
                    trackArtistColor: "#ccc",
                    trackNameColor: "#fff",
                  }}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col  items-center mt-6 tracks">
            {tracks &&
              tracks!.map((item: ITrack) => (
                <Track item={item} isActive={item.track.id === trackActive} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import axios from "axios";
import SpotifyPlayer from "react-spotify-web-playback";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const AUTH_ENDPOINT = import.meta.env.VITE_AUTH_ENDPOINT;
const RESPONSE_TYPE = "token";
const SCOPES = import.meta.env.VITE_SCOPES;

interface IPlaylist {
  id: string;
  name: string;
  images: Array<{
    url: string;
  }>;
}

interface ITrack {
  id?: string;
  track: {
    id: string;
    name: string;
  };
}

interface IState {
  isPlaying: boolean;
  track: {
    id: string;
  };
}

interface IEventTarget extends EventTarget {
  id: string;
}

interface IEvent extends React.MouseEvent<HTMLDivElement, MouseEvent> {
  target: IEventTarget;
}

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [playlist, setPlaylist] = useState<IPlaylist[] | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<string | null>(null);
  const [tracks, setTracks] = useState<ITrack[] | null>(null);
  const [play, setPlay] = useState<boolean>(true);
  const [trackActive, setTrackActive] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash
      .substring(1)
      .split("&")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .reduce((initial: any, item: string) => {
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
        setCurrentPlaylist(res.data.items[0].id);
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
        }
      )
      .then((res) => {
        setTracks(res.data.items);
        setTrackActive(res.data.items[0].track.id);
      });
  }, [currentPlaylist, token]);

  const selectPlaylist = (e: IEvent) => {
    const id: string = e.target.id;
    setCurrentPlaylist(id);
  };

  return (
    <div className="App">
      {!token ? (
        <div className="Login max-h-full h-56 grid content-center">
          <button className="">
            <a
              href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`}
              className="btn btn--login bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login to Spotify
            </a>
          </button>
        </div>
      ) : (
        <div>
          <div className="playlist flex justify-center">
            {playlist &&
              playlist!.map((item: IPlaylist) => (
                <div
                  className="playlist-item px-2 h-32 flex  flex-row justify-center place-items-center hover:bg-gray-700"
                  key={item.id}
                  onClick={selectPlaylist}
                >
                  <img
                    src={item.images[0].url}
                    alt={item.name}
                    id={item.id}
                    className="h-1/2"
                  />
                  <div className="playlist-item-details">
                    <h2
                      id={item.id}
                      className="place-items-center text-white mx-5 border-b-2 border-transparent "
                    >
                      {item.name}
                    </h2>
                  </div>
                </div>
              ))}
          </div>
          <div className="player w-1/2 translate-x-1/2 mt-6">
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
          <div className="tracks flex flex-col place-items-center justify-center mt-6">
            {tracks &&
              tracks!.map((item: ITrack) =>
                trackActive && item.track.id === trackActive ? (
                  <div className="track-item" key={item.track.id}>
                    <div className="track-item-details text-red-400">
                      <h2>{item.track.name}</h2>
                    </div>
                  </div>
                ) : (
                  <div className="track-item" key={item.track.id}>
                    <div className="track-item-details text-white">
                      <h2>{item.track.name}</h2>
                    </div>
                  </div>
                )
              )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

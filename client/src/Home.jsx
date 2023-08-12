import {Link} from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'vidstack/styles/defaults.css';
import 'vidstack/styles/community-skin/video.css';
import { MediaCommunitySkin, MediaOutlet, MediaPlayer, MediaPoster } from '@vidstack/react';

const getGoogleAuthUrl = () => {
    const {VITE_GOOGLE_CLIENT_ID, VITE_REDIRECT_URI} = import.meta.env
    const url = `https://accounts.google.com/o/oauth2/v2/auth`
    const query = {
        client_id : VITE_GOOGLE_CLIENT_ID,
        redirect_uri: VITE_REDIRECT_URI,
        response_type: 'code',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ].join(' '),
        prompt: 'consent',
        access_type : 'offline'
    }
    const queryString = new URLSearchParams(query).toString()
    return `${url}?${queryString}`
}
const googleOAuthUrl = getGoogleAuthUrl()

export default function Home() {
  const isAuthenicated = Boolean(localStorage.getItem('access_token'))
  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    window.location.reload()
  }

    return (
        <>
          <div>
            <span>
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </span>
            <span>
              <img src={reactLogo} className="logo react" alt="React logo" />
            </span>
          </div>
          <h2>Video Streaming</h2>
          <video controls width={500}>
            <source src="http://localhost:3000/static/video-stream/cdcc688352146921324303a02.mp4" type="video/mp4" />
          </video>
          <h2>HLS Streaming</h2>
          <MediaPlayer
            title="Sprite Fight"
            src="http://localhost:3000/static/video-hls/6lQgZQuVxxqYRmFySCKjP/master.m3u8"
            // poster="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/thumbnail.webp?time=268&width=980"
            // thumbnails="https://media-files.vidstack.io/sprite-fight/thumbnails.vtt"
            aspectRatio={16 / 9}
            crossorigin=""
          >
          <MediaOutlet>
            <MediaPoster
              alt="Girl walks into sprite gnomes around her friend on a campfire in danger!"
            />
          {/* <track
              src="https://media-files.vidstack.io/sprite-fight/subs/english.vtt"
              label="English"
              srcLang="en-US"
              kind="subtitles"
              default
            />
            <track
              src="https://media-files.vidstack.io/sprite-fight/chapters.vtt"
              srcLang="en-US"
              kind="chapters"
              default
            /> */}
          </MediaOutlet>
          <MediaCommunitySkin />
          </MediaPlayer>
          <h1>Google Oauth 2.0</h1>
          <p className="read-the-docs">
            {isAuthenicated ? 
            <> 
            <span>Hello my friend, you are logged in</span>
            <button onClick={logout}>Logout</button>
            </>
             :(<Link to={googleOAuthUrl}>Login with Google</Link>)
            }
          </p>
        </>
      )
}
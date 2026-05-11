import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { GoogleOAuthProvider } from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="294123448374-sn8m15ah1rh147q9an3bt32kvkhke5uh.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
)
import Snowfall from 'react-snowfall'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app'
import { BrowserRouter, HashRouter } from 'react-router-dom'

const useHash = import.meta.env.VITE_USE_HASH === 'true';
const Router = useHash ? HashRouter : BrowserRouter

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Snowfall color='#82C3D9'/>
      <App />
    </Router>
  </StrictMode>,
)

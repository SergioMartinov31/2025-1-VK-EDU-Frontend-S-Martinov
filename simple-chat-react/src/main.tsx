import Snowfall from 'react-snowfall'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app'
import { BrowserRouter, HashRouter } from 'react-router-dom'

import { store } from './app/store/store'
import { Provider } from 'react-redux'


// Polyfill for browser builds where some deps expect Node's global.
if (!(globalThis as { global?: typeof globalThis }).global) {
  (globalThis as { global?: typeof globalThis }).global = globalThis;
}

const useHash = import.meta.env.VITE_USE_HASH === 'true';
const Router = useHash ? HashRouter : BrowserRouter

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Provider store={store}>
      <Snowfall color='#82C3D9'/>
      <App />
      </Provider>
    </Router>
  </StrictMode>,
)

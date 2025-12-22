// src/main.jsx
import Snowfall from 'react-snowfall'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, HashRouter } from 'react-router-dom'

import { Provider } from 'react-redux'
import { store } from './store' // Импортируем магазин


/**
 * Для переключения между BrowserRouter и HashRouter:
 * - Создай файл .env в корне проекта и добавь:
 *     VITE_USE_HASH=true
 *   или
 *     VITE_USE_HASH=false
 *
 * По умолчанию — BrowserRouter (если переменная не задана).
 */
const useHash = import.meta.env.VITE_USE_HASH === 'true'
const Router = useHash ? HashRouter : BrowserRouter

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <Router>
      <Snowfall color='#82C3D9'/>
      <App />
    </Router>
    </Provider>
  </StrictMode>,
)

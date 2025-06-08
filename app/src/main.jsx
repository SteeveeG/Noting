import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import Home from './Pages/home/home'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Home />
  </StrictMode>,
)

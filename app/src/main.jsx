import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import NotusApp from './components/NotusApp/NotusApp'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NotusApp />
  </StrictMode>,
)

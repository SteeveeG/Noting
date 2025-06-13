import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import Home from './Pages/home/home'
import EditableTextBox from './components/test/EditableTextBox'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <Home /> */}
    <EditableTextBox />
    <EditableTextBox />
  </StrictMode>,
)

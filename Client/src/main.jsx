import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.jsx'

// const style = document.createElement('style')
// style.textContent = document.head.appendChild(style)

// document.addEventListener('contextmenu', (e) => {
//   e.preventDefault()
// })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MarchingCubes from './MarchingCubes.jsx'
// import Combine from './Combine.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MarchingCubes />
  </StrictMode>,
)

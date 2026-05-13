import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './components/styles/base/main.scss';
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

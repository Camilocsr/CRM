import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'; // Importa el provider
import './index.css'

const clientIdGoogle = import.meta.env.VITE_CLIENT_ID_GOOGLE; 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientIdGoogle}> {/* Envuelve tu App */}
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
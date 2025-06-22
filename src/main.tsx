// Buffer polyfill for browser environment - MUST BE FIRST
import { Buffer } from 'buffer';

// Set global Buffer polyfill
globalThis.Buffer = Buffer;
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

// Now import React and other modules
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
 
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 
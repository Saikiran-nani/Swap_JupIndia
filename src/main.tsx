// Polyfills for browser environment
import { Buffer } from 'buffer';
import crypto from 'crypto-browserify';
import stream from 'stream-browserify';
import util from 'util';

// Set global polyfills
globalThis.Buffer = Buffer;
globalThis.crypto = crypto;
globalThis.stream = stream;
globalThis.util = util;

if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
  (window as any).crypto = crypto;
  (window as any).stream = stream;
  (window as any).util = util;
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
 
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 
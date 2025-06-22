declare module 'crypto-browserify';
declare module 'stream-browserify';

declare global {
  interface Window {
    Buffer: typeof Buffer;
    crypto: any;
    stream: any;
    util: any;
  }
  
  var Buffer: typeof Buffer;
  var crypto: any;
  var stream: any;
  var util: any;
}

export {}; 
declare module 'crypto-browserify';
declare module 'stream-browserify';
declare module 'process';

declare global {
  interface Window {
    Buffer: typeof Buffer;
    crypto: any;
    stream: any;
    util: any;
    process: any;
  }
  
  var Buffer: typeof Buffer;
  var crypto: any;
  var stream: any;
  var util: any;
  var process: any;
}

export {}; 